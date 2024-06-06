const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const serviceObject = require('../models/ServiceReturnObject')
const jwt = require('jsonwebtoken')
const userModel = require('../models/User');
require('dotenv').config();

const Service = {
    login: async (userInfo) => {
        try {
            const user = await userModel.findOne({ UserName: userInfo.UserName }).exec();
        
            if (user) {
              const passwordMatch = await bcrypt.compare(userInfo.Password, user.Password);
        
              if (passwordMatch) {
                if(user.Status.toLowerCase() === 'active'){
                    let data = {
                        Gmail: user.Gmail,
                        FullName: user.FullName,
                        UserName: user.UserName,
                        Role: user.Role,
                        FirstLogin: user.FirstLogin,
                        Avatar: user.Avatar
                    }
                    let token = {
                      Gmail: user.Gmail,
                      UserName: user.UserName,
                      Role: user.Role,
                      FirstLogin: user.FirstLogin,
                      FullName: user.FullName
                    }
                    data.Identity = Service.encodeData(token)
                    return new serviceObject(200, null, data)
                }
                else{
                    return new serviceObject(403, 'Account blocked or inactive, please check email or phone admin to activate account', null)
                }
              } else {
                return new serviceObject(401, 'Wrong password', null);
              }
            } else {
              // User not found
              return new serviceObject(400, 'Not Found', null);
            }
          } catch (error) {
            console.error('Login error:', error);
            return new serviceObject(500, error.message, null);
          }
    },
    validateAccount: async (userInfo) => {
        try {
            console.log('here')
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
            if(await userModel.findOneAndUpdate({Gmail: decoded.UserGmail}, {$set: {Status: 'active'}})){      
                return new serviceObject()
            }
            return new serviceObject(400, 'invalid account', null)
          } catch (error) {
            console.error('JWT verification failed:', error)
            return new serviceObject(410, 'Expired link', null)
          }
    },
    changeInfo: async (userInfo) => {
      let temp = await userModel.findOne({UserName: userInfo.UserName})
      if(userInfo.OldPassword && userInfo.Password){
        try{
          if(! await bcrypt.compare(userInfo.OldPassword, temp.Password)){
            return new serviceObject(400, 'Wrong password',null)   
          }
          if(userInfo.Password){
            await userModel.findOneAndUpdate({UserName: userInfo.UserName},
                {$set: {Password: await bcrypt.hash(userInfo.Password, 10), FirstLogin: false}})     
          }
          else{
            return new serviceObject(404, 'Lack of information', null) 
          }
        }catch(error){
            return new serviceObject(404, error.message, null)
        }
      }
      if(userInfo.Avatar){
        await userModel.findOneAndUpdate(
          {UserName: userInfo.UserName},
          {Avatar: Buffer.from(userInfo.Avatar)}
        )
      }
      return new serviceObject()
  },
    encodeData: (data) => {
        // Convert the Mongoose document to a plain JavaScript object
        // const plainObject = data.toObject();
      
        // Sign the plain object
        const token = jwt.sign(data, process.env.ADMIN_CODE, {
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