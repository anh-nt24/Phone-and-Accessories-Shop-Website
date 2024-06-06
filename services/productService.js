const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const productModel = require('../models/Product')
const orderDetailModel =require('../models/OrderDetail')
const inputObject = require('../models/ModelTemplate')
const serviceObject = require('../models/ServiceReturnObject');
const { AsyncResource } = require('async_hooks');
require('dotenv').config()

const Service = {
    createProduct: async (productInfo) => {
        try{
            if(productInfo.Role != 'admin'){
                return new serviceObject(401, 'Unauthorized', null)
            }
            let productInput = inputObject.Product
            let barCode = 0
            while(await productModel.findOne({BarCode: barCode.toString().padStart(9, '0')})){
                barCode++
            }
            productInput.ImportPrice = productInfo.ImportPrice
            productInput.ProductName = productInfo.ProductName
            productInput.BarCode = barCode.toString().padStart(9, '0')
            productInput.Category = productInfo.Category
            productInput.RetailPrice = productInfo.RetailPrice
            let Product = new productModel(productInput)
            await Product.save()
            return new serviceObject()
        } catch(error){
            return new serviceObject(404, error.message, null)
        }
    },
    getProductList: async (user) => {
        let productList = await productModel.find()
        if(user.Role != 'admin'){
            for(let item of productList){
                item.ImportPrice = null
            }
        }
        return new serviceObject(200, null, productList)
    },
    getSpecificProduct: async (user, productID) => {
        let product = await productModel.findById(productID.id)
        if(user.Role != 'admin'){
            product.ImportPrice = null
        }
        return new serviceObject(200, null, product)
    },
    findProductByNameOrBarCode: async (user, product) => {
        let filteredProduct = await productModel.find({BarCode: product.key})
        if(filteredProduct.length <= 0){
            let productList = (await Service.getProductList(user)).data
            filteredProduct = productList.filter(item => item.ProductName.toLowerCase().indexOf(product.key.toLowerCase()) != -1)
        }
        if(user.Role != 'admin'){
            for(let item of filteredProduct){
                item.ImportPrice = null
            }
        }
        return new serviceObject(200, null, filteredProduct)
    }, 
    getProductByCategory: async (user, category) => {
        let filteredProduct = await productModel.find({Category: category.key})
        if(user.Role != 'admin'){
            for(let item of filteredProduct){
                item.ImportPrice = null
            }
        }
        return new serviceObject(200, null, filteredProduct)
    },
    changeProductInfo: async (productID, productInfo) => {
        if(productInfo.Role != 'admin'){
            return new serviceObject(401, 'Unauthorized', null)
        }
        let updatedProduct = await productModel.findByIdAndUpdate(
            productID.id,
            productInfo,
            {new: true, runValidators: true}
        )
        if(!updatedProduct){
            return new serviceObject(404, "Product not found", "Bad request")
        }
        return new serviceObject()
    },
    deleteProduct: async (productID, user) => {
        if(user.Role != 'admin'){
            return new serviceObject(401, 'Unauthorized', null)
        }
        if(! await orderDetailModel.findById(productID.id)){
            await productModel.findByIdAndDelete(productID.id)
            return new serviceObject()
        }
        return new serviceObject(409, "product is already in order", "Conflict")
    }
}

module.exports = Service