const express = require('express');
const router = express.Router();
const brandController = require('../controller/brandController');

router.post('/addBrand', brandController.addBrand);
router.get('/getAllBrands', brandController.GetAllBrands);
router.post('/deletebrandbyid', brandController.DeleteBrandById);

module.exports = router;