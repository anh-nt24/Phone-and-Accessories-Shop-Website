const express = require('express')
const router = express.Router()

const orderController = require('../controllers/orderController')

router.get('/:id', orderController.getDetailOrder)
router.post('/product', orderController.addProduct)
router.delete('/product', orderController.removeProduct)
router.post('/payment', orderController.payment)
router.get('/printInvoice/:id', orderController.printInvoice)

module.exports = router