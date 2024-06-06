customerService = require('../services/customerService')

class customer{
    createAccount = async (req, res) => {
        let object = await customerService.createAccount(req.body)
        return res.status(object.status).json(object)
    }
    viewOrderOfCustomer = async (req, res) => {
        let object = await customerService.viewOrderOfCustomer(req.params)
        return res.status(object.status).json(object)
    }
    getCustomerInfo = async (req, res) => {
        let object = await customerService.getCustomerInfo(req.params)
        return res.status(object.status).json(object)
    }
}

module.exports = new customer