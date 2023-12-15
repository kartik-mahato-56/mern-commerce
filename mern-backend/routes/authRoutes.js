const express = require('express');
const authController = require('../controllers/authController')
const {signupFormValidate, loginFormValidation} = require('../utils/formValidation')

const router = express.Router()

router.post('/signUp',signupFormValidate, authController.signUp);

//verify user email
router.get('/emailVerify/:token', authController.veryfyUserEmail)

router.post("/login", loginFormValidation, authController.login)
//send password reset email
router.post('/sendPasswordResetEmail', authController.sendPasswordResetEmail)
//reset password
router.post('/resetPassword/:token', authController.resetPassword)
 module.exports = router
