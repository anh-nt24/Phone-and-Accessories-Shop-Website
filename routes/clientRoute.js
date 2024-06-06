const express = require('express')
const router = express.Router()

const customer = require('../controllers/customerController')

router.post('/', customer.createAccount)
router.get('/info/:phoneNumber', customer.getCustomerInfo)
router.get('/:phoneNumber', customer.viewOrderOfCustomer)


module.exports = router