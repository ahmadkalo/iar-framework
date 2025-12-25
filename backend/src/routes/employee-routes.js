
const express = require("express");
const router = express.Router();
const employeeApi = require("../apis/employee-api");
const { checkAuthorization } = require("../middlewares/auth-middleware");

// Sync aus OrangeHRM → MongoDB
router.post("/employees/sync/:id", checkAuthorization(true), employeeApi.syncEmployeeFromOrangeHrm);

// Lesen aus MongoDB
router.get("/employees/:id", checkAuthorization(), employeeApi.getEmployee);
router.get("/employees", checkAuthorization(), employeeApi.getAllEmployees);

module.exports = router;
