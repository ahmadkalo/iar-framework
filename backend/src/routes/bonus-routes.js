const express = require("express");
const router = express.Router();
const bonusApi = require("../apis/bonus-api");
const { checkAuthorization } = require("../middlewares/auth-middleware");

// 1) Create Proposal
router.post(
    "/bonus/social/:employeeId/:year/propose",
    checkAuthorization(),
    bonusApi.createSocialBonusProposal
);

// 2) Proposal
router.get(
    "/bonus/proposals/:proposalId",
    checkAuthorization(),
    bonusApi.getProposal
);

// 3) CEO/Admin: approve
router.post(
    "/bonus/proposals/:proposalId/approve",
    checkAuthorization(true),
    bonusApi.approveProposal
);

// 4) CEO/Admin: reject
router.post(
    "/bonus/proposals/:proposalId/reject",
    checkAuthorization(true),
    bonusApi.rejectProposal
);

router.put(
    "/bonus/proposals/:proposalId/remarks",
    checkAuthorization(true), // CEO oder HR
    bonusApi.updateRemarks
);


module.exports = router;
