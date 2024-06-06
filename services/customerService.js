const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const customerModel = require('../models/Customer')
const orderModel = require('../models/Order')
const inputObject = require('../models/ModelTemplate')
const serviceObject = require('../models/ServiceReturnObject')
require('dotenv').config()

const Service = {
    createAccount: async (customerInfo) => {
        try{
            let customer = new customerModel(customerInfo)
            if(! await customerModel.findOne({PhoneNumber: customer.PhoneNumber}).exec()){
                await customer.save()
                return new serviceObject()
            }
            return new serviceObject(409, "Phone number already exist", null)
        }catch(err){
            return new serviceObject(404, "Wrong input", null)
        }
    },
    getCustomerInfo: async (customerInfo) => {
        let customer = await customerModel.findOne({PhoneNumber: customerInfo.phoneNumber}).exec()
            if(customer){
                return new serviceObject(200, null, customer)
            }
            return new serviceObject(404, "Phonenumber not found", null)
    },
    viewOrderOfCustomer: async (customer) => {
        try{
            let order = await orderModel.find({PhoneNumber: customer.phoneNumber})
            if(order){
                return new serviceObject(200, null, order)
            }
            else{
                return new serviceObject(404, "No order found", null)
            }
        }catch(error){
            return new serviceObject(404, error.message, "Bad request")
        }
    }
}

module.exports = Service