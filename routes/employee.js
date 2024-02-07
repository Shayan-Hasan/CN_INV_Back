const express = require("express");
const router = express.Router();
const employeeController = require("../controller/employeeController");

router.post("/addEmployee", employeeController.addEmployee);
router.put("/editEmployee", employeeController.editEmployee);
router.post("/getEmployeeByID", employeeController.getEmployeeByID);
router.get("/getAllEmployees", employeeController.getAllEmployees);
router.get("/getAllManagers", employeeController.getAllManagers);
router.post("/CheckEmpNameExist", employeeController.CheckEmpNameExist);
router.post("/getAllManagersByID", employeeController.getAllManagersByID);
router.post("/DeleteEmp", employeeController.DeleteEmp);

module.exports = router;
