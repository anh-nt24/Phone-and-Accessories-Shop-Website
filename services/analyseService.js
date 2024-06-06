const productModel = require('../models/Product')
const orderDetailModel =require('../models/OrderDetail')
const orderModel = require('../models/Order')
const inputObject = require('../models/ModelTemplate')
const productService = require('./productService')
const serviceObject = require('../models/ServiceReturnObject');
const { AsyncResource } = require('async_hooks');
require('dotenv').config()

const Service = {
    getAnalyticReport: async (report) => {
        let data = await orderModel.find({
            DateOfPurchase: {
                $gte: new Date(report.From),
                $lte: new Date(report.To)
            }
        })
        if(report.Order.toLowerCase() != 'ascending'){
            data = data.sort({DateOfPurchase: -1})
        }
        let totalAmount = data.reduce((acc, order) => acc + order.toObject().TotalAmount, 0)
        let numberOfProductSold = await productModel.find({},'ProductName SoldByProduct SoldByOrder')
        let totalNumberOfProductSold = numberOfProductSold.reduce((acc, product) => acc + product.toObject().SoldByProduct, 0)
        let totalProfit = null
        if(report.Role == 'admin'){
            productsList = await productService.getProductList(report)
            totalProfit = productsList.data.reduce((acc, product) => acc + (product.toObject().RetailPrice - product.toObject().ImportPrice) * product.toObject().SoldByProduct, 0)            
            console.log(productsList.data)
        }
        return new serviceObject(200, null, {
            orders: data,
            totalAmount: totalAmount,
            numberOfOrder: data.length,
            numberOfProductSold: numberOfProductSold,
            totalNumberOfProductSold: totalNumberOfProductSold,
            totalProfit: totalProfit
        })
    }
}

module.exports = Service