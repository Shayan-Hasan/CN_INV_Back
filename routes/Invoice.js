const express = require("express");
const router = express.Router();

const invoiceController = require("../controller/invoiceController");

router.post("/GetInvoiceProdBySoId", invoiceController.GetInvoiceProdBySoId);
router.post(
  "/GetInvoiceDetailBySoId",
  invoiceController.GetInvoiceDetailBySoId
);
router.post("/GetPOProdByPoId", invoiceController.GetPOProdByPoId);
router.post("/GetPODetailByPoId", invoiceController.GetPODetailByPoId);

module.exports = router;
