const express = require('express')
const {verifyAdmin} = require('../middlewares/verifyWebToken')
const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const {subCategoryFormValidation} = require('../utils/formValidation')
const subCategoryController = require('../controllers/subCategoryController')


const router = express.Router();
router.get("/dashbaord", verifyAdmin, adminController.dashboard);

//---------------- Category API's ------------------------------
router.get('/allCategories', verifyAdmin, categoryController.allCategories)
router.post('/addUpdateCategory', verifyAdmin, categoryController.addUpdateCategories);
router.get('/getCategoryById/:id', verifyAdmin, categoryController.getCategoryById);
router.delete('/deleteCategory', verifyAdmin, categoryController.deleteCategory)

// --------------- Sub Category API's -----------------------
router.post("/add-update-subcategory", subCategoryFormValidation, verifyAdmin, subCategoryController.addUpdateSubCategory);
router.get('/sub-categories', verifyAdmin, subCategoryController.getAllSubCategories)
module.exports = router
