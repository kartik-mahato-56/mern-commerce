const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        thumb: {
            type: String,
            required:true,
        },
        slugUrl:{
            type:String,
            required:true
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    },
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
