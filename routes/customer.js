const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const customerController = require("../controller/customerController");

router.post(
  "/addCustomer",
  upload.single("profile"),
  customerController.addCustomer
);
router.put(
  "/editCustomer",
  upload.single("profile"),
  customerController.editCustomer
);
router.post("/getCustomerByID", customerController.getCustomerByID);
router.post(
  "/getCustomerOrderListByID",
  customerController.getCustomerOrderListByID
);
router.post(
  "/getCustomerOrderDetailByID",
  customerController.getCustomerOrderDetailByID
);
router.post(
  "/getCustomerFavListByID",
  customerController.getCustomerFavListByID
);
router.post(
  "/addCustomerFavListByID",
  customerController.addCustomerFavListByID
);
router.delete(
  "/removeCustomerFavListByID",
  customerController.removeCustomerFavListByID
);
router.get("/getAllCustomers", customerController.getAllCustomers);
router.get("/getAllCustomersName", customerController.getAllCustomersName);
router.post("/CheckCusNameExist", customerController.CheckCusNameExist);
router.post("/CheckCusDeleteStatus", customerController.CheckCusDeleteStatus);
router.post("/DeleteCustomer", customerController.DeleteCustomer);

module.exports = router;
