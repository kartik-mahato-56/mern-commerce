require("dotenv").config();
const config = {
    mail: {
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_SERVER,
        port: process.env.MAIL_PORT,
        tls: process.env.MAIL_USE_TLS,
    },
    database:{
        url: process.env.DB_URL,
        name: process.env.DB_NAME
    },
    jwt_secret : process.env.JWT_SECRET
};
module.exports = config;
