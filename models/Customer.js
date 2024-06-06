const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    Name: String,
    PhoneNumber: String,
    Address: String
})

const customerChar = mongoose.model('customerChar', CustomerSchema)
module.exports = customerChar
