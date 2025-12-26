const express = require("express");
const router = express.Router();
const bonusApi = require("../apis/bonus-api");
const { checkAuthorization } = require("../middlewares/auth-middleware");

// nur berechnen
router.get("/bonus/social/:employeeId/:year", checkAuthorization(), bonusApi.computeSocialBonus);

// berechnen + speichern (CEO/Admin)
router.post("/bonus/social/:employeeId/:year/store", checkAuthorization(true), bonusApi.computeAndStoreSocialBonus);

module.exports = router;
