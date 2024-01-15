const SubCategory = require("../models/SubCategory");

//-----create or update subcategory data --------------
exports.updateOrCreate = async (request) => {
    const subCategory = request.id
        ? await SubCategory.findById(request.id)
        : new SubCategory({ ...request });
    if (request.id) {
        subCategory.set({ ...request });
    }
    return await subCategory.save();
};
// -- find subcategory by id ---------------
exports.findSubCategoryById = async (id) => {
    return SubCategory.findById(id);
};

exports.getSubCategories  = async(data={})=>{
    return SubCategory.find(data).populate("categoryId");
}
