const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');

router.post('/addCategory', categoryController.addCategory);
router.get('/getAllCategories', categoryController.GetAllCategories);
router.post('/deletecategorybyid', categoryController.DeleteCategoryById);

module.exports = router;