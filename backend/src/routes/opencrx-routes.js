const express = require("express");
const router = express.Router();
const opencrxApi = require("../apis/opencrx-api");

// GET /api/opencrx/accounts
router.get("/accounts", opencrxApi.getAllAccounts);

// GET /api/opencrx/accounts/:id
router.get("/accounts/:id", opencrxApi.getAccountById);

module.exports = router;
