const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
    try {
        const dbURl = `${config.database.url}/${config.database.name}?authSource=admin`;
        const conn = await mongoose.connect(dbURl);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = { connectDB };
