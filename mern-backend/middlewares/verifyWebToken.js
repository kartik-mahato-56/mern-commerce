const jwt = require("jsonwebtoken");
const config = require("../config/config");

function verifyWebtoken(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            message: "No Authorization Header",
        });
    }
    try {
        const token = authorization.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Invalid Token Format",
            });
        }
        const decode = jwt.verify(token, SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Session Expired",
                error: error.message,
            });
        }
        if (
            error instanceof jwt.JsonWebTokenError ||
            error instanceof TokenError
        ) {
            return res.status(401).json({
                message: "Invalid Token",
                error: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal server Error",
            error: error.message,
            stack: error.stack,
        });
    }
}

async function generateToken(payload) {
    const token = jwt.sign(payload, config.jwt_secret, { expiresIn: "1d" }); // You can change the expiration time as needed

    return token;
}

const verifyAdmin = async (req, res, next) => {
    try {
        this.verifyWebtoken(req, res, () => {
            const isAdmin = req.user && req.user.userRole === "ADMIN";
            if (!isAdmin) {
                res.status(403).json({
                    success: false,
                    message:
                        "Foridden - You're not authorized to acccess this site",
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};
module.exports = { verifyWebtoken, generateToken, verifyAdmin };
