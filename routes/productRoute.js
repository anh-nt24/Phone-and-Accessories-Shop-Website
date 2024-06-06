const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.post('/', productController.createProduct)
router.get('/', productController.getProductList)
router.get('/:id', productController.getSpecificProduct)
router.put('/:id', productController.changeProductInfo)
router.delete('/:id', productController.deleteProduct)
router.get('/category/:key', productController.getProductByCategory)
// <<<<<<< HEAD
// =======
router.get('/search/:key', productController.findProductByNameOrBarCode)


// >>>>>>> refs/remotes/origin/main
module.exports = router