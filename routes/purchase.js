const express = require("express");
const router = express.Router();

const purchaseController = require("../controller/purchaseController");

router.post("/getAllPurchaseByID", purchaseController.getAllPurchaseByID);
router.post(
  "/getProductsByStoreVendorId",
  purchaseController.getProductsByStoreVendorId
);
router.post("/addPurchaseOrder", purchaseController.addPurchaseOrder);
router.post(
  "/getPurchaseOrderDetailsByID",
  purchaseController.getPurchaseOrderDetailsByID
);
router.post(
  "/getPurchaseOrderVendorByID",
  purchaseController.getPurchaseOrderVendorByID
);
router.post("/EditPurchaseOrder", purchaseController.EditPurchaseOrder);
router.post(
  "/deleteEditPurchaseOrderProduct",
  purchaseController.deleteEditPurchaseOrderProduct
);
router.post(
  "/getReceiveProductsByPO_ID",
  purchaseController.getReceiveProductsByPO_ID
);
router.post(
  "/getReceiveLogPurchaseOrderByID",
  purchaseController.getReceiveLogPurchaseOrderByID
);
router.post("/EditReceive_Log", purchaseController.EditReceive_Log);
router.post(
  "/getPurchaseOrderDetailRecByID",
  purchaseController.getPurchaseOrderDetailRecByID
);
router.post(
  "/getPurchaseOrderDetail",
  purchaseController.getPurchaseOrderDetail
);
router.post(
  "/EditPurchaseStatusBYPo_id",
  purchaseController.EditPurchaseStatusBYPo_id
);
router.post("/GetAccToIdByPusOrder", purchaseController.GetAccToIdByPusOrder);
router.post(
  "/GetReceiveLogDetailByid",
  purchaseController.GetReceiveLogDetailByid
);
router.post(
  "/GetSpecialOrderProdDetail",
  purchaseController.GetSpecialOrderProdDetail
);
router.post("/getAllPurchaseByVenID", purchaseController.getAllPurchaseByVenID);

module.exports = router;
