const express = require("express");
const router = express.Router();
const orangehrmApi = require("../apis/orangehrm-api");

router.get("/login", orangehrmApi.login);
// ➕ NEU: GET ALL EMPLOYEES
router.get("/employees", orangehrmApi.getAllEmployees);


module.exports = router;
