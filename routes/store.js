const express = require("express");
const router = express.Router();
const storeController = require("../controller/storeController");

router.get("/getAllStores", storeController.getAllStores);
router.post("/addStore", storeController.addStore);
router.get("/getAllStoreDetails", storeController.getAllStoreDetails);
router.post("/getProductByStoreID", storeController.getProductByStoreID);
router.post("/getStoreByID", storeController.getStoreByID);
router.put("/editStoreApi", storeController.editStoreApi);
router.post("/CheckStoreNameExist", storeController.CheckStoreNameExist);
router.post(
  "/getProductFilterSubString",
  storeController.getProductFilterSubString
);
router.post("/getAllProductByStoreID", storeController.getAllProductByStoreID);
router.post("/CheckStoreBeforeDel", storeController.CheckStoreBeforeDel);
router.post("/DelStore", storeController.DelStore);

module.exports = router;
