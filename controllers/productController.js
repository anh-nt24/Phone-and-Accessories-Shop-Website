productService = require('../services/productService.js')

class product{
    createProduct = async (req, res) => {
        let object = await productService.createProduct(req.body)
        return res.status(object.status).json(object) 
    }

    getProductList = async (req, res) => {
        let object = await productService.getProductList(req.body)
        return res.status(object.status).json(object)
    }

    getSpecificProduct = async (req, res) => {
        let object = await productService.getSpecificProduct(req.body, req.params)
        return res.status(object.status).json(object)
    }

    findProductByNameOrBarCode = async (req, res) => {
        let object = await productService.findProductByNameOrBarCode(req.body, req.params)
        return res.status(object.status).json(object)
    }

    getProductByCategory = async (req, res) => {
        let object = await productService.getProductByCategory(req.body, req.params)
        return res.status(object.status).json(object)
    }

    changeProductInfo = async (req, res) => {
        let object = await productService.changeProductInfo(req.params, req.body)
        return res.status(object.status).json(object)
    }

    deleteProduct = async (req, res) => {
        let object = await productService.deleteProduct(req.params, req.body)
        return res.status(object.status).json(object)
    }
}
module.exports = new product
