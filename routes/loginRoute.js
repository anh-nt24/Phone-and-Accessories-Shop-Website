const express = require('express')
const router = express.Router()
const loginController = require('../controllers/loginController')
const { error } = require('console')

router.post('/firstLogin/:code', loginController.validateAccount)
router.post('/', loginController.login)
router.post('/changeInfo', loginController.changeInfo)
module.exports = router