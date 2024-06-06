orderService = require('../services/orderService.js')

class order{
    getDetailOrder = async (req, res) => {
        let object = await orderService.getDetailOrder(req.params)
        return res.status(object.status).json(object)
    }
    addProduct = async (req, res) => {
        let order = await orderService.addProduct(req.body)
        console.log(order)
        let object = await orderService.getDetailOrder({id: order.data.orderID})
        return res.status(object.status).json(object)
    }
    removeProduct = async (req, res) => {
        let object = await orderService.removeProduct(req.body)
        if(! object.error){
            object = await orderService.getDetailOrder({id: object.data.orderID})
        }
        return res.status(object.status).json(object)
    }
    payment = async (req, res) => {
        let object = await orderService.payment(req.body)
        return res.status(object.status).json(object)
    }
    printInvoice = async (req, res) => {
        let object = await orderService.printInvoice(req.params)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf')
        object.data.pipe(res)
        // return res.status(object.status).json(object)
    }
}

module.exports = new order