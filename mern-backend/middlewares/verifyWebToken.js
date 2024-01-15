const jwt = require("jsonwebtoken");
const config = require("../config/config");

function verifyWebtoken(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            success:false,
            message: "Forbidden - You're not authorized to access this site",
        });
    }
    try {
        const token = authorization.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({
                success:false,
                message: "Invalid Token Format",
            });
        }
        const decode = jwt.verify(token, config.jwt_secret);
        req.user = decode;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success:false,
                message: "Session Expired, please login again",
                error: error.message,
            });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                succes:false,
                message: "Invalid Token",
                error: error.message,
            });
        }
        return res.status(500).json({
            success:false,
            message: "Internal server Error",
            error: error.message,
            stack: error.stack,
        });
    }
}

async function generateToken(payload) {
    const token = jwt.sign(payload, config.jwt_secret, { expiresIn: "7d" }); // You can change the expiration time as needed
    return token;
}

const verifyAdmin = async (req, res, next) => {
    try {
        await verifyWebtoken(req, res, () => {
            const isAdmin = req.user && req.user.userRole.includes("ADMIN");
            if (isAdmin) {
                next(); 
            } else {
               return res.status(403).json({
                    success: false,
                    message:
                        "Forbidden - You're not authorized to access this site",
                });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal server error",
        });
    }
};
module.exports = { verifyWebtoken, generateToken, verifyAdmin };
