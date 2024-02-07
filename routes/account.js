const express = require("express");
const router = express.Router();

const accountController = require("../controller/accountController");

router.get("/getAllAccounts", accountController.getAllAccounts);
router.get("/GetAllAccountTypes", accountController.GetAllAccountTypes);
router.post("/AddAccountOpeningBal", accountController.AddAccountOpeningBal);
router.post("/getAccountByID", accountController.getAccountByID);
router.put("/EditAccountOpeningBal", accountController.EditAccountOpeningBal);
router.post("/CheckAccNameExist", accountController.CheckAccNameExist);
router.post("/CheckDefaultAcc", accountController.CheckDefaultAcc);
router.post("/CheckAccDeleteStatus", accountController.CheckAccDeleteStatus);
router.post("/DeleteAccount", accountController.DeleteAccount);

module.exports = router;
