const express = require("express");
const router = express.Router();
const orangehrmApi = require("../apis/orangehrm-api");

router.get("/login", orangehrmApi.login);

module.exports = router;
