const adminController = require('../controllers/admin.controller')

const router = require('express').Router()

router.get('/all-products', adminController.getProducts)
router.get('/product/:id', adminController.getProduct)

router.post('/product', adminController.createProduct)

router.put('/product/:id', adminController.editProduct)

router.delete('/product/:id', adminController.deleteProduct)

module.exports = router
