const categoryService = require("../services/categoryService");
const {
    sendResponse,
    imageExtensionCheck,
    uploadImage,
    deleteFile,
} = require("../utils/helper");

//-- save or update category
exports.addUpdateCategories = async (req, res) => {
    try {
        let request = req.body;
        if (request.name === undefined || request.name === "") {
            sendResponse(res, false, 422, "Name filed is required");
        } else if (
            request.status &&
            !["Active", "Inactive"].includes(request.status)
        ) {
            sendResponse(res, false, 422, "Invalid status for category");
        } else {
            if (req.files) {
                if (request.categoryId) {
                    let category = await categoryService.categoryFind(
                        request.categoryId,
                    );
                    if (category) {
                        console.log(category.thumb);
                        await deleteFile(
                            `public/uploads/categories/${category.thumb}`,
                        );
                    }
                }
                let thumbImage = req.files.thumb;
                let fileName = await imageExtensionCheck(thumbImage);
                if (fileName) {
                    request.thumb = fileName;
                    await uploadImage(
                        "uploads/categories",
                        fileName,
                        thumbImage,
                    );
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
            let category =
                await categoryService.updateOrCreateCategory(request);
            if (category) {
                sendResponse(
                    res,
                    true,
                    200,
                    "Category successfully saved",
                    category,
                );
            } else {
                sendResponse(
                    res,
                    true,
                    200,
                    "Failed to save category",
                    category,
                );
            }
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message, {});
    }
};
// -- find any category using id
exports.getCategoryById = async (req, res) => {
    try {
        let categoryId = req.params.id;
        let category = await categoryService.categoryFind(categoryId);
        if (category) {
            sendResponse(
                res,
                true,
                200,
                "Category details fetched successfully",
                category,
            );
        } else {
            sendResponse(res, false, 200, "Category not found!");
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message);
    }
};
// -- get all categories
exports.allCategories = async (req, res) => {
    try {
        let categories = await categoryService.getAllCategories();
        if (categories) {
            sendResponse(
                res,
                true,
                200,
                "All categories retrived successfully",
                categories,
            );
        } else {
            sendResponse(res, false, 200, "No categories found");
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, false, 500, error.message);
    }
};
// ! DELETE CATEGORY USING ID
exports.deleteCategory = async (req, res) => {
    try {
        let categoryId = req.query.categoryId;
        if (!categoryId) {
            sendResponse(res, false, 422, "Invalid request");
        } else {
            let category = await categoryService.categoryFind(categoryId);
            if (!category) {
                sendResponse(res, false, 422, "Category not found");
            } else {
                await deleteFile(`public/uploads/categories/${category.thumb}`);
                await category.deleteOne();
                sendResponse(res, true, 200, "Category deleted successfull");
            }
        }
    } catch (err) {
        console.log(err);
        sendResponse(res, false, 500, err.message);
    }
};
