const authController = require('../controllers/auth.controller')

const router = require('express').Router()

router.post('/login', authController.login)
router.post('/register', authController.register)

router.get('/verify/:verifyToken', authController.verify)
router.get('/logout', authController.logout)

router.post('/send-otp', authController.sendOtp)
router.post('/verify-otp', authController.verifyOtp)

router.post('/reset-password', authController.resetPassword)

module.exports = router
