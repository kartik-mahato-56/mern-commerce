const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slugUrl: {
            type: String,
            required: true,
        },
        categoryId:{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:'Category'
        },
        thumb: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    },
);

const SubCategory = mongoose.model('SubCategory', SubCategorySchema)
module.exports = SubCategory;
