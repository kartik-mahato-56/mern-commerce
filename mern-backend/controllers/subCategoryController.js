const {
    sendResponse,
    imageExtensionCheck,
    uploadImage,
    deleteFile,
} = require("../utils/helper");
const { validationResult } = require("express-validator");
const subCategoryServices = require("../services/subCategoryServices");
const Category = require("../models/Category");

exports.addUpdateSubCategory = async (req, res) => {
    try {
        const request = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let simplifiedErrors = {};
            errors.array().forEach((error) => {
                if (!simplifiedErrors[error.path]) {
                    simplifiedErrors[error.path] = error.msg;
                }
            });
            sendResponse(res, false, 422, simplifiedErrors);
        } else {
            // -- Upload thumb image -------
            if (req.files) {
                if (request.id) {
                    let categoryDetails =
                        await subCategoryServices.findSubCategoryById(
                            request.id,
                        );
                    if (categoryDetails) {
                        console.log(categoryDetails+'--------------category details')
                        await deleteFile(categoryDetails.thumb);
                    }
                }
                let thumbImage = req.files.thumb;
                let fileName = await imageExtensionCheck(thumbImage);
                if (fileName) {
                    request.thumb = await uploadImage(
                        "uploads/subCategories",
                        fileName,
                        thumbImage,
                    );
                    console.log(request.thumb)
                } else {
                    sendResponse(
                        res,
                        false,
                        422,
                        "Only JPEG, JPG, PNG are allowed",
                    );
                }
            }
            request.slugUrl =
                request.name.toLowerCase().replace(/[^\w\'@s-]/g, "-") +
                "-store";
            let subCategory = await subCategoryServices.updateOrCreate(request);
            subCategory
                ? sendResponse(
                      res,
                      true,
                      200,
                      "Sub category saved successfully",
                      subCategory,
                  )
                : sendResponse(
                      res,
                      false,
                      200,
                      "Failed to save sub category details",
                  );
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message);
    }
};

exports.getAllSubCategories = async(req, res)=>{
    try {
        let subCategories = await subCategoryServices.getSubCategories();
        if(subCategories){
            sendResponse(res, true, 200, 'Successfully retrieved sub categories',subCategories);
        }else{
            sendResponse(res, false, 200, 'No Sub Categories Found');
        }
    } catch (error) {
        console.log(error)
        sendResponse(res, false, 500,error.message)
    }
}
exports.subCategoryDetails = async(req, res)=>{
    try {
        const subCategoryId = req.params.id;
        let subCategory = await subCategoryServices.findSubCategoryById(subCategoryId);
        subCategory ? sendResponse(res, true, 200, 'Subcategory details retrieved', subCategory) : sendResponse(res, false, 404, 'Subcategory not found!');
    } catch (error) {
        console.log(error)
        sendResponse(res, false, 500, error.message);
    }
}
