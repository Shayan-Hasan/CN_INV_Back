const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventoryController');

router.get('/getAllInventory', inventoryController.getAllInventory);
router.post('/AddInventory', inventoryController.AddInventory);
router.get('/getopeningBal', inventoryController.getopeningBal);
router.get('/verifyopeningbalexist', inventoryController.verifyopeningbalexist);
router.post('/AddOpeningBalance', inventoryController.AddOpeningBalance);
router.put('/EditOpeningBalance', inventoryController.EditOpeningBalance);
router.get('/getinvStock', inventoryController.getinvStock);
router.post('/AddInStock', inventoryController.AddInStock);
router.post('/AddOutStock', inventoryController.AddOutStock);

module.exports = router;