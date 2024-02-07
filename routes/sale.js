const express = require("express");
const router = express.Router();

const saleController = require("../controller/saleController");

router.post("/getAllSalesByID", saleController.getAllSalesByID);
router.post("/getCustomerByID", saleController.getCustomerByID);
router.post("/addSaleOrder", saleController.addSaleOrder);
router.post("/getSaleOrderDetailsByID", saleController.getSaleOrderDetailsByID);
router.post(
  "/getSaleOrderCustomerByID",
  saleController.getSaleOrderCustomerByID
);
router.post(
  "/deleteEditSaleOrderProduct",
  saleController.deleteEditSaleOrderProduct
);
router.post("/EditSaleOrder", saleController.EditSaleOrder);
router.post(
  "/RemoveProd_fromShipmentTrans",
  saleController.RemoveProd_fromShipmentTrans
);
router.post(
  "/getSaleOrderDetailShipmentByID",
  saleController.getSaleOrderDetailShipmentByID
);
router.post("/getSaleOrderDetail", saleController.getSaleOrderDetail);
router.post(
  "/getShipmentSaleOrderByID",
  saleController.getShipmentSaleOrderByID
);
router.post(
  "/getShipmentProductsBySO_ID",
  saleController.getShipmentProductsBySO_ID
);
router.post("/EditShipment", saleController.EditShipment);
router.post("/EditSaleOrderStatus", saleController.EditSaleOrderStatus);
router.post("/addEstimation", saleController.addEstimation);
router.post(
  "/EditSaleOrderStatusBYSo_id",
  saleController.EditSaleOrderStatusBYSo_id
);
router.post("/EditEstimation", saleController.EditEstimation);
router.post("/GetAccToIdBySaleOrder", saleController.GetAccToIdBySaleOrder);

router.post("/ConvertEst", saleController.ConvertEst);

router.post("/getSaleCusBalByID", saleController.getSaleCusBalByID);
router.post("/GetAccToIdBySaleOrder1", saleController.GetAccToIdBySaleOrder1);
router.post("/GetShipmentDetailByid", saleController.GetShipmentDetailByid);

module.exports = router;
