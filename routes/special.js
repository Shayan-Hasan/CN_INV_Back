const express = require("express");
const router = express.Router();
const specialController = require("../controller/specialController");

router.post("/AddSpecialOrder", specialController.AddSpecialOrder);
router.post("/EditSpecialOrder", specialController.EditSpecialOrder);
router.post("/GetSpecialOrderDetail", specialController.GetSpecialOrderDetail);
router.post(
  "/GetSpecialOrderProdByStoreID",
  specialController.GetSpecialOrderProdByStoreID
);
router.post("/GetVendorList", specialController.GetVendorList);
router.post(
  "/EditSpecialOrderPurchase",
  specialController.EditSpecialOrderPurchase
);

module.exports = router;
