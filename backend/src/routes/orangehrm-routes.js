const express = require("express");
const router = express.Router();
const orangehrmApi = require("../apis/orangehrm-api");

router.get("/login", orangehrmApi.login);
router.get("/employees", orangehrmApi.getAllEmployees);
router.get("/employees/:id", orangehrmApi.getEmployeeById);

module.exports = router;
