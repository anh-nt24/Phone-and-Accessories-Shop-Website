const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    TotalAmount: Number,
    AmountOfMoneyGivenByCustomer: Number,
    ExcessAmount: Number,
    DateOfPurchase: Date,
    PhoneNumber: String,
    EmployeeName: String
})

const OrderChar = mongoose.model('OrderChar', OrderSchema)
module.exports = OrderChar
