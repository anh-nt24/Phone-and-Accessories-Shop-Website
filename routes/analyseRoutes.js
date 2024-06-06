const express = require('express')
const router = express.Router()

const analyseController = require('../controllers/analyseController')

router.post('/', analyseController.getAnalyticReport)

module.exports = router