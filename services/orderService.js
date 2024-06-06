const mongoose = require('mongoose')
const customerModel = require('../models/Customer')
const orderModel = require('../models/Order')
const orderDetailModel = require('../models/OrderDetail')
const productModel = require('../models/Product')
const productService = require('./productService')
const inputObject = require('../models/ModelTemplate')
const serviceObject = require('../models/ServiceReturnObject')
const moment = require('moment')
const PDFDocument = require('pdfkit')
require('dotenv').config()

const Service = {
    getDetailOrder: async (order) => {
        let detailOrder = await orderDetailModel.find(
            {
                OrderID: order.id
            }
        ).exec()
        for (let item of detailOrder){
            let Quantity = item.Quantity
            Object.assign(item, await productModel.findOne({BarCode: item.BarCode}))
            item.Quantity = Quantity
        }
        return new serviceObject(200, null, detailOrder)
    },
    addProduct: async (product) => {
        let productsByID = []
        for(let i of product.OrderDetails){
            let item = await productModel.findById(i.ProductID)
            item = item.toObject()
            item.Quantity = i.Quantity
            productsByID.push(item)
        }
        try{
            let orderInProcess = await orderModel.findOne(
                {
                    PhoneNumber: product.PhoneNumber,
                    DateOfPurchase: null
                })
            if(orderInProcess){
                for(let productByID of productsByID){
                    let orderedProduct = await orderDetailModel.findOne(
                        {
                            OrderID: orderInProcess._id,
                            BarCode: productByID.BarCode 
                        }
                    )
                    if(! orderedProduct){
                        await new orderDetailModel(
                            {
                                OrderID: orderInProcess._id,
                                BarCode: productByID.BarCode,
                                Quantity: productByID.Quantity
                            }
                        ).save()
                    }
                    else{
                        await orderDetailModel.findOneAndUpdate(
                            {
                                OrderID: orderInProcess._id,
                                BarCode: productByID.BarCode,
                            },
                            {
                                $set: {Quantity: productByID.Quantity + orderedProduct.Quantity}
                            }
                        )
                    }
                }
            }
            else{
                let orderTemplate = inputObject.Order
                orderTemplate.PhoneNumber = product.PhoneNumber
                await orderModel(orderTemplate).save()
                orderInProcess = await orderModel.findOne(
                {
                        PhoneNumber: product.PhoneNumber,
                        DateOfPurchase: null
                }).exec()
                for(let productByID of productsByID){
                    await new orderDetailModel(
                        {
                            OrderID: orderInProcess._id,
                            BarCode: productByID.BarCode,
                            Quantity: productByID.Quantity
                        }
                    ).save()
                }
            }
            return new serviceObject(200, null, {orderID: orderInProcess._id})
        }catch(error){
            return new serviceObject(500, error.message, null)
        }
    },
    removeProduct: async (product) => {
        let productsByID = []
        for(let i of product.OrderDetails){
            let item = await productModel.findById(i.ProductID)
            item = item.toObject()
            item.Quantity = i.Quantity
            productsByID.push(item)
        }
        try{
            let orderInProcess = await orderModel.findOne(
                {
                    PhoneNumber: product.PhoneNumber,
                    DateOfPurchase: null
                }).exec()
            for(let productByID of productsByID){
                let orderProduct = await orderDetailModel.findOne({
                    OrderID: orderInProcess._id,
                    BarCode: productByID.BarCode
                })
                if(orderProduct.Quantity > productByID.Quantity){
                    await orderDetailModel.updateOne(
                        {
                            OrderID: orderInProcess._id,
                            BarCode: productByID.BarCode
                        },
                        {
                            $set: {Quantity: orderProduct.Quantity - productByID.Quantity}
                        }
                    )
                }
                else if(orderProduct.Quantity == productByID.Quantity){
                    await orderDetailModel.deleteOne(
                        {
                            OrderID: orderInProcess._id,
                            BarCode: productByID.BarCode
                        }
                    )
                }
                else{
                    return new serviceObject(200, `${productByID.ProductName} quantity exceed available`, null)
                }
            }
            return new serviceObject(200, null, {orderID: orderInProcess._id})
        }
        catch(error){
            return new serviceObject(500, error.message, null)
        }
    },
    payment: async (order) => {
        let orderInProcess = await orderModel.findOne(
            {
                PhoneNumber: order.PhoneNumber,
                DateOfPurchase: null
            }).exec()
        if(! orderInProcess){
            return new serviceObject(400, "Nothing to purchase", null)
        }
        let detailOrder = await Service.getDetailOrder({id: orderInProcess._id})
        let totalAmount = 0
        for(let item of detailOrder.data){
            item = item.toObject()
            totalAmount += item.RetailPrice * item.Quantity
        }
        if(order.AmountOfMoneyGivenByCustomer < totalAmount){
            return new serviceObject(402, "Not enough money", null)
        }
        for(let item of detailOrder.data){
            item = item.toObject()
            await productModel.findOneAndUpdate(
                {_id: item._id},
                {$inc: {
                    SoldByProduct: item.Quantity,
                    SoldByOrder: 1
                }}
            )
        }
        let tempData = {
            _id: orderInProcess._id,
            TotalAmount: totalAmount,
            AmountOfMoneyGivenByCustomer: order.AmountOfMoneyGivenByCustomer,
            ExcessAmount: order.AmountOfMoneyGivenByCustomer - totalAmount,
            DateOfPurchase: moment().format('DD-MM-YYYY HH:mm:ss'),
            PhoneNumber: order.PhoneNumber,
            EmployeeName: order.FullName
        }
        let payment = await orderModel.updateOne(orderInProcess, tempData)
        return new serviceObject(200, null, tempData)
    },
    printInvoice: async (orderID) => {
        let order = await orderModel.findById(orderID.id).then(ord => ord.toObject())
        let customer = await customerModel.findOne({PhoneNumber: order.PhoneNumber})
        let items = await Service.getDetailOrder({id: order._id}).then(items => items.data)
        let invoice = order
        invoice.info = customer
        invoice.items = items
        console.log(invoice)
        let doc = Service.createInvoice(invoice)
        return new serviceObject(200, null, doc)
    },
    createInvoice: (invoice) => {
        let doc = new PDFDocument({ margin: 50 });
      
        // Function to generate header
      // Function to generate header
        function generateHeader() {
            let y = 100
            doc
            .fontSize(40) // Increase font size to 20
            .fillColor('darkblue') // Set text color to dark blue
            .font('Helvetica-Bold')
            .text('INVOICE', 50, 45)
            .fillColor('black') // Reset text color to black for the rest of the text
            .font('Helvetica')
            .fontSize(15)
            .text(`Customer name: ${invoice.info.Name}`, 50, y)
            .text(`Customer address: ${invoice.info.Address}`, 50, y+=20)
            .text(`Customer phone number: ${invoice.info.PhoneNumber}`, 50, y+=20)
            .text(`Employee name: ${invoice.EmployeeName}`, 50, y+=20)
            .text(`Date of purchase: ${invoice.DateOfPurchase}`, 50, y+=20)
            .moveDown();
            return y
        }
      
        let y = generateHeader(); // Invoke `generateHeader` function.
      
        // Function to generate table for invoice items
        function generateTable(y) {
          const tableTop = y+=100;
          const rowHeight = 20;
          const col1 = 50;
          const col2 = 150;
          const col3 = 300;
          const col4 = 450;
      
          doc
            .fontSize(12)
            .text('Item', col1, tableTop)
            .text('Unit price', col2, tableTop)
            .text('Quantity', col3, tableTop)
            .text('Amount', col4, tableTop);
      
          y = tableTop + rowHeight;
          invoice.items.forEach((item) => {
            item = item.toObject()
            doc
              .fontSize(10)
              .text(item.ProductName, col1, y)
              .text(item.RetailPrice, col2, y)
              .text(item.Quantity, col3, y)
              .text(`${(item.RetailPrice * item.Quantity).toFixed(2)}`, col4, y);
            y += rowHeight;
          });
          return y
        }
      
        y = generateTable(y); // Invoke `generateTable` function.
      
        // Function to generate subtotal and paid amount
        function generateTotal(y) {
          doc
          .moveDown()
          .fontSize(15)
          .text(`Total: ${invoice.TotalAmount.toFixed(2)}`, 400, y+=100)
          .text(`Receive: ${invoice.AmountOfMoneyGivenByCustomer.toFixed(2)}`, 400, y+=20)
          .text(`Return: ${invoice.ExcessAmount.toFixed(2)}`, 400, y+=20)
          return y
        }
      
        generateTotal(y); // Invoke `generateTotal` function.
      
        doc.end();
        // doc.pipe(fs.createWriteStream(path));
        return doc
    }
}
module.exports = Service