const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    ImportPrice: Number,
    ProductName: String,
    BarCode: String,
    Status: String,
    CreationDate: Date,
    Category: String,
    RetailPrice: Number,
    SoldByProduct: Number,
    SoldByOrder: Number,
})

const ProductChar = mongoose.model('productChar', ProductSchema)
module.exports = ProductChar
