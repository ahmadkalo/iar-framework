const express = require("express");
const router = express.Router();
const bonusApi = require("../apis/bonus-api");
const { checkAuthorization } = require("../middlewares/auth-middleware");

// Postman-Demo: Bonus berechnen
router.get("/bonus/social/:employeeId/:year", checkAuthorization(), bonusApi.computeSocialBonus);

module.exports = router;
