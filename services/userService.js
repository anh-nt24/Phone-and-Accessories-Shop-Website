const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const user = require('../models/ModelTemplate')
const serviceObject = require('../models/ServiceReturnObject')
const jwt = require('jsonwebtoken')
const userModel = require('../models/User');
const { decode } = require('punycode');
const { userInfo } = require('os');
const { findOne } = require('../models/Customer');
require('dotenv').config();

const Service = {
// <<<<<<< HEAD
    login: async (userInfo) => {
        try {
            const user = await userModel.findOne({ UserName: userInfo.UserName }).exec();
        
            if (user) {
              const passwordMatch = await bcrypt.compare(userInfo.Password, user.Password);
        
              if (passwordMatch) {
                return new serviceObject(200, null, {
                    Identity: Service.encodeData(user),
                    Role: user.Role
                  });
              } else {
                return new serviceObject(401, null, 'Unauthorized');
              }
            } else {
              // User not found
              return new serviceObject(404, null, 'Not Found');
            }
          } catch (error) {
            console.error('Login error:', error);
            return new serviceObject(500, null, 'Internal Server Error');
          }
    },
// =======
// >>>>>>> refs/remotes/origin/main
    validateAccount: async (userInfo) => {
        try {
            const decoded = await new Promise((resolve, reject) => {
              jwt.verify(userInfo.code, process.env.ADMIN_CODE, (err, decoded) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(decoded);
                }
              });
            });
            console.log('Decoded JWT:', decoded)
            if(await userModel.findOne({Gmail: decoded.Gmail})){
                await userModel.updateOne({Gmail: decoded.Gmail}, {$set: {Status: 'active'}})
                return new serviceObject()
            }
            return new serviceObject(400, 'invalid account', null)
          } catch (error) {
            console.error('JWT verification failed:', error)
            return new serviceObject(410, 'Expired link', null)
          }
    },
    getInfo: async (userInfo) => {
        const data = await userModel.findOne({Gmail: userInfo.Gmail}).exec()
        if(data){
          return new serviceObject(200, null, data)
        }
        return new serviceObject(404, 'invalid account', null)
    },
    encodeData: (data) => {
        // Convert the Mongoose document to a plain JavaScript object
        const plainObject = data.toObject();
      
        // Sign the plain object
        const token = jwt.sign(plainObject, process.env.ADMIN_CODE, {
          expiresIn: '24h',
        });
      
        return token;
    },
    decodeData: async (encrypted) => {
        return await new Promise((resolve, reject) => {
            jwt.verify(encrypted, process.env.ADMIN_CODE, (err, decoded) => {
              if (err) {
                reject(err);
              } else {
                resolve(decoded);
              }
            });
          });
    }
}

module.exports = Service