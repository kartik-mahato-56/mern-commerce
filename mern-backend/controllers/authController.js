const { sendResponse } = require("../utils/helper");
const { validationResult } = require("express-validator");
const userService = require("../services/userService");
const randomstring = require("randomstring");
const sendMail = require("../config/sendMail");
const JWT = require("jsonwebtoken");
const config = require("../config/config");
const bCrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken } = require("../middlewares/verifyWebToken");

exports.signUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = [];
            errors.array().forEach((error) => {
                errorMessages.push({ field: error.path, msg: error.msg });
            });
            console.log(errorMessages);
            sendResponse(res, false, 422, errorMessages);
        } else {
            let request = req.body;
            let userExist = await userService.checkUserByEmailOrPhone(
                request.email,
                request.phone,
            );
            if (userExist) {
                sendResponse(res, false, 200, "User already exist");
            } else {
                const emailToken = randomstring.generate();
                request = { ...request, emailToken: emailToken };
                let user = await userService.createUser(request);
                if (user) {
                    await sendMail.signUpMail(res, user);
                    sendResponse(res, true, 200, "Sign up successfull", user);
                } else {
                    sendResponse(res, false, 200, "sign up failed", request);
                }
            }
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message);
    }
};

// verify user email after sign up
exports.veryfyUserEmail = async (req, res) => {
    try {
        const token = req.params.token;
        if (!token) {
            sendResponse(res, false, 404, "Invalid token");
        } else {
            let user = await userService.findOneByField({ emailToken: token });
            if (!user) {
                sendResponse(
                    res,
                    false,
                    200,
                    "Invalid link or may be link has been expired",
                );
            } else {
                user.emailToken = "";
                user.emailVerified = true;
                user = await user.save({ validateModifiedOnly: true });
                return res.render("success");
            }
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message);
    }
};

//login user
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = [];
            errors.array().forEach((error) => {
                errorMessages.push({ field: error.path, msg: error.msg });
            });
            console.log(errorMessages);
            sendResponse(res, false, 422, errorMessages);
        } else {
            let request = req.body;
            let user = await userService.findOneByField({
                email: request.email,
            });
            if (user) {
                if (!user.role.includes(request.role)) {
                    sendResponse(
                        res,
                        false,
                        403,
                        "Forbidden - You're not authorized to access this site",
                        {},
                    );
                } else {
                    if (bCrypt.compareSync(request.password, user.password)) {
                        const token = await generateToken({
                            userId: user.id,
                            userRole: user.role,
                        });
                        let { password, ...userData } = {
                            ...user._doc,
                            accessToken: token,
                        };
                        sendResponse(
                            res,
                            true,
                            200,
                            "Login successfull",
                            userData,
                        );
                    } else {
                        sendResponse(res, false, 401, "Incorrect password", {});
                    }
                }
            } else {
                sendResponse(res, false, 404, "User does not exist", {});
            }
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message);
    }
};

//send password reset mail
exports.sendPasswordResetEmail = async (req, res) => {
    try {
        if (req.body.email === undefined || req.body.email === null) {
            sendResponse(res, false, 422, "Email is required");
        } else {
            let user = await userService.findOneByField({
                email: req.body.email,
            });
            if (user) {
                const emailToken = randomstring.generate();
                user.emailToken = emailToken;
                user = await user.save({ validateModifiedOnly: true });
                await sendMail.sendPasswordResetEmail(res, user);
                sendResponse(res, true, 200, "Password reset link sent", user);
            } else {
                sendResponse(res, false, 404, "User does not exist", {});
            }
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message);
    }
};
exports.resetPasswordForm = async (req, res) => {
    try {
        const passwordRessetToken = req.params.token;
        const errorMessage = req.flash("error")[0];
        let user = userService.findOneByField({
            emailToken: passwordRessetToken,
        });
        if (user) {
            return res.render("reset-password", {
                emailToken: passwordRessetToken,
                errorMessage: errorMessage,
            });
        } else {
            return res.render("link-expired");
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message);
    }
};

exports.resetPasswordSubmit = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let simplifiedErrors = {};
            errors.array().forEach((error) => {
                if (!simplifiedErrors[error.path]) {
                    simplifiedErrors[error.path] = error.msg;
                }
            });
            console.log(simplifiedErrors);
            req.flash("error", simplifiedErrors);
            return res.redirect(
                `/api/auth/resetPassword/${req.body.emailToken}`,
            );
        } else {
            const { password, confirmPassword } = req.body;
            let user = await userService.findOneByField({
                emailToken: req.body.emailToken,
            });
            if (user) {
                user.emailToken = "";
                user.password = password;
                user = await user.save({ validateModifiedOnly: true });
                return res.render("success", {
                    message: "Password changed successfully",
                });
            } else {
                req.flash("error", {
                    message: "Invalid link or may be link has been expired",
                });
                return res.redirect(
                    `/api/auth/resetPassword/${req.body.emailToken}`,
                );
            }
        }
    } catch (error) {
        sendResponse(res, false, 500, error.message);
    }
};
