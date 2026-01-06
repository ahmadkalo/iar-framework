const express = require("express");
const router = express.Router();
const bonusApi = require("../apis/bonus-api");
const { checkAuthorization } = require("../middlewares/auth-middleware");

// 1) Proposal erstellen (berechnen) – darf eingeloggt sein
router.post(
    "/bonus/social/:employeeId/:year/propose",
    checkAuthorization(),
    bonusApi.createSocialBonusProposal
);

// 2) Proposal ansehen
router.get(
    "/bonus/proposals/:proposalId",
    checkAuthorization(),
    bonusApi.getProposal
);

// 3) CEO/Admin: approve -> speichert in OrangeHRM
router.post(
    "/bonus/proposals/:proposalId/approve",
    checkAuthorization(true),
    bonusApi.approveProposal
);

// 4) CEO/Admin: reject -> speichert NICHT
router.post(
    "/bonus/proposals/:proposalId/reject",
    checkAuthorization(true),
    bonusApi.rejectProposal
);

module.exports = router;
