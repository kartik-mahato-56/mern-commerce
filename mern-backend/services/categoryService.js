const Category = require('../models/Category')

exports.updateOrCreateCategory = async(request)=>{
   const category = request.categoryId
       ? await Category.findById(request.categoryId)
       : new Category({ ...request });
    if (request.categoryId) {
        category.set({ ...request });
    }
   return await category.save();
}

exports.categoryFind = async(id)=>{
    return Category.findById(id)
}

exports.getAllCategories = async() =>{
    return Category.find()
}
