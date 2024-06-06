const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderDetailSchema = new Schema({
    OrderID: String,
    BarCode: String,
    Quantity: Number
})

const OrderDetailChar = mongoose.model('OrderDetailChar', OrderDetailSchema)
module.exports = OrderDetailChar
