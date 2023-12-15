const { sendResponse } = require("../utils/helper");
const { validationResult } = require("express-validator");
const userService = require("../services/userService");
const randomstring = require("randomstring");
const sendMail = require("../config/sendMail");
const JWT = require("jsonwebtoken");
const config = require("../config/config");
const bCrypt = require("bcrypt");

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
                return res.render('success');
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
                if (bCrypt.compareSync(request.password, user.password)) {
                    const token = JWT.sign(
                        { _id: user._id, role: user.role },
                        config.jwt_secret,
                        { expiresIn: "7d" },
                    );
                    let { password, ...userData } = {
                        ...user._doc,
                        accessToken: token,
                    };
                    sendResponse(res, true, 200, "Login successfull", userData);
                } else {
                    sendResponse(res, false, 401, "Incorrect password", {});
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
        if(req.email === undefined || req.email === null) {
            sendResponse(res, false, 422, "Email is required");
        } else {
            let user = await userService.findOneByField({
                email: req.email,
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
}
 exports.resetPassword = async(req,res) =>{
    try {
        const passwordRessetToken = req.params.token;

        let user = userService.findOneByField({emailToken:token});
        if(user){

        }else{
            
        }
        
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message);
    }
 }
