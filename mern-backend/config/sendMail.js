const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fsPromise = require("fs").promises;
const path = require("path");require("dotenv").config;
const config = require("./config");

exports.signUpMail = async (res, user) => {
    var transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port, // Port for TLS (587) or SSL (465)
        secure: config.mail.tls, // true for 465, false for other ports
        auth: {
            user: config.mail.username, // Your email address
            pass: config.mail.password, // Your email password (or application-specific password)
        },
        requireTLS: true, // Force TLS
    });

    const htmlData = await fsPromise.readFile(
        path.join(__dirname, "..", "views/mails/sign-up.ejs"),
        "utf-8"
    );
    const compiledTemplate = await ejs.compile(htmlData);
    const mailOptions = {
        from: config.mail.username,
        to: user.email,
        subject: "Thank you for signing up",
        html: compiledTemplate({
            url: `${process.env.APP_URL}/api/auth/emailVerify/${user.emailToken}`,
        }),
    };
    await transporter.sendMail(mailOptions);
}

exports.sendPasswordResetEmail = async (res, user) => {
    var transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port, // Port for TLS (587) or SSL (465)
        secure: config.mail.tls, // true for 465, false for other ports
        auth: {
            user: config.mail.username, // Your email address
            pass: config.mail.password, // Your email password (or application-specific password)
        },
        requireTLS: true, // Force TLS
    });

    const htmlData = await fsPromise.readFile(
        path.join(__dirname, "..", "views/mails/forgot-password.ejs"),
        "utf-8",
    );
    const compiledTemplate = await ejs.compile(htmlData);
    const mailOptions = {
        from: config.mail.username,
        to: user.email,
        subject: "Password Reset",
        html: compiledTemplate({
            url: `${process.env.APP_URL}/api/auth/resetPassword/${user.emailToken}`,
        }),
    };
    await transporter.sendMail(mailOptions);
}
