const { body } = require("express-validator");

const signupFormValidate = [
    body("name")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long"),
    body("email")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("phone")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Phone number is required")
        .matches(/^\d{10}$/)
        .withMessage("Invalid phone number. It should be 10 digits."),
    body("confirmPassword")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Confirm password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .custom((value, { req }) => {
            // Check if the passwords match
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
];

const loginFormValidation = [
    body("email")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
const passwordResetFormValidation = [
    body("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Confirm password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .custom((value, { req }) => {
            // Check if the passwords match
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
];
module.exports = {
    signupFormValidate,
    loginFormValidation,
    passwordResetFormValidation,
};
