const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

router.post('/addPayment', paymentController.addPayment);
router.post('/editPayment', paymentController.editPayment);
router.post('/deletePayment', paymentController.deletePayment);
router.get('/getAllPaymentDetail', paymentController.getAllPaymentDetail);
router.get('/getAccNamesCash', paymentController.getAccNamesCash);
router.get('/getAccNameCusVen', paymentController.getAccNameCusVen);
router.post('/getAcc1BalFrom', paymentController.getAcc1BalFrom);
router.post('/getPaymentDetailByID ', paymentController.getPaymentDetailByID );
router.get('/getAllPaymentDetail_Pay', paymentController.getAllPaymentDetail_Pay);


module.exports = router;