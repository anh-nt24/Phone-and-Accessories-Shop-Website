const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const user = require('../models/User')
const orderModel = require('../models/Order')
const inputObject = require('../models/ModelTemplate')
const serviceObject = require('../models/ServiceReturnObject')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fs = require('fs')
const moment = require('moment');
const { userInfo } = require('os');

function readImageFile(filePath) {
    try {
      // Read the image file synchronously (for simplicity)
      const imageData = fs.readFileSync(filePath);
      const imageBuffer = Buffer.from(imageData);
      return imageBuffer;
    } catch (error) {
      console.error('Error reading image file:', error.message);
      return null;
    }
  }


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SYSTEM_MAIL,
    pass: process.env.SYSTEM_MAIL_PASS
  }
})

const Service = {
    defaultAdmin: async () => {
        try {
          const hashedPassword = await bcrypt.hash(process.env.ADMIN_CODE, 10);
          const admin = new user({
            FullName: 'admin',
            Gmail: 'admin@gmail.com',
            Role: 'admin',
            UserName: Service.createUserName('admin@gmail.com'),
            Password: hashedPassword,
            Avatar: readImageFile('../nodejs-final-project/image/weather.png'),
            FirstLogin: false,
            Status: 'active',
            SecretCode: ''
          });
          await admin.save();
        } catch (error) {
          console.error('Error creating default admin:', error);
        }
      },
    createUserAccount: async (userInfo) => {
      try {
        if(!(userInfo.UserGmail && userInfo.UserFullName)){
          return new serviceObject(400, "Lack of information", null)
        }
        if(await user.findOne({Gmail: userInfo.UserGmail})){
          console.log(await user.findOne({Gmail: userInfo.UserGmail}))
          return new serviceObject(409, "Gmail is already taken", null)
        }
        const hashedPassword = await bcrypt.hash(Service.createUserName(userInfo.UserGmail), 10)
        let userInput = inputObject.User
        // Change object's input
        userInput.Gmail = userInfo.UserGmail
        userInput.UserName = Service.createUserName(userInfo.UserGmail),
        userInput.Password = hashedPassword,
        userInput.FullName = userInfo.UserFullName
        const User = new user(userInput)
        await User.save()
        return new serviceObject()  // Corrected instantiation with new keyword
      } catch (error) {
        return new serviceObject(500, error.message, null)
      }
    },
    sendValidateMail: async (userInfo, URL) => {
      secretCode = jwt.sign(userInfo, process.env.ADMIN_CODE,{
        expiresIn: '60s'
      })
      const mailText = `
        <p>Your validation link: <a href="http://${URL}/login?key=${secretCode}">Click here to validate</a></p>
        <p>Your password is: ${Service.createUserName(userInfo.UserGmail)}</p>
      `
      const mailOptions = {
        from: process.env.SYSTEM_MAIL,
        to: userInfo.UserGmail,
        subject: 'Compulsory first login method',
        html: mailText
      };
      
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return new serviceObject(500, error.message, null)
        } 
      })
      return new serviceObject()
    },
    getEmployeesList: async () => {
      const data = await user.find({ Role: 'user' }, 'Gmail FullName UserName').exec()
      return new serviceObject(200, null, data)
    },
    getEmployeeById: async (userInfo) => {
      const data = await user.findById(userInfo.id).exec()
      if(data){
        return new serviceObject(200, null, data)
      }
      return new serviceObject(404, 'invalid account', 'Bad request')
    },
    getSaleOfEmployee: async (userInfo) => {
      let employee = await user.findById(userInfo.id)
      try{
        let saleInfo = await orderModel.find(
          {
            EmployeeName: employee.FullName
          }
        )
        return new serviceObject(200, null, saleInfo)
      }catch(error){
        return new serviceObject(400, error, null)
      }
    },
    lockOrUnlock: async (userInfo, request) => {
      const data = await user.findById(userInfo.id).exec();
      if (data) {
        await user.updateOne(
          { _id: userInfo.id },
          { $set: { Status: (request.Request.toLowerCase() === 'lock') ? 'lock' : 'active' } }
        );
        return new serviceObject(200, null, await user.findById(userInfo.id));
      }
      return new serviceObject(404, 'Invalid account', 'Bad request');
    },
    createUserName: (Gmail) => {
        gmailExtract = Gmail.split('@')
        return gmailExtract[0]
    },
    findIDByGmail: async (Gmail) => {
      data = await user.findOne(
        {Gmail: Gmail}
      ).exec()
      return data._id
    }
}

module.exports = Service