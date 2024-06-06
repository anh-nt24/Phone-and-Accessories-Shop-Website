const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController')
const { error } = require('console')

router.post('/createUser', adminController.createUserAccount)
router.post('/mailbox', adminController.sendValidateMail)
router.get('/employees', adminController.getEmployeesList)
router.get('/employee/:id', adminController.getEmployeeById)
router.get('/sale/:id', adminController.getSaleOfEmployee)
router.put('/lockAndUnlock/:id', adminController.lockOrUnlock)

module.exports = router