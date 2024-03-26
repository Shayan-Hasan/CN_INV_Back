const express = require('express');
const router = express.Router();
const unitController = require('../controller/unitController');

router.post('/addUnit', unitController.addUnit);
router.get('/getAllUnits', unitController.GetAllUnits);
router.post('/deleteunitbyid', unitController.DeleteUnitById)

module.exports = router;