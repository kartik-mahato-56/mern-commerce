const express = require("express");
const authController = require("../controllers/authController");
const {
    signupFormValidate,
    loginFormValidation,
    passwordResetFormValidation,
} = require("../utils/formValidation");

const router = express.Router();

router.post("/signUp", signupFormValidate, authController.signUp);
//verify user email
router.get("/emailVerify/:token", authController.veryfyUserEmail);

router.post("/login", loginFormValidation, authController.login);
//send password reset email
router.post("/sendPasswordResetEmail", authController.sendPasswordResetEmail);

//reset password
router.get("/resetPassword/:token", authController.resetPasswordForm);

//reset password
router.post("/resetPasswordSubmit",passwordResetFormValidation, authController.resetPasswordSubmit)
module.exports = router;
