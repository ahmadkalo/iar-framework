const socialService = require("./socialPerformance-service");
const salesmenService = require("./salesmen-service");
const orangehrmService = require("./orangehrm-service");
const { calculateSocialBonus } = require("../utils/social-bonus");
const mongodb = require("mongodb");

// Collection name for proposals
const PROPOSALS_COL = "bonusProposals";


exports.computeSocialBonus = async function (db, employeeId, targetYear) {
    const empId = Number(employeeId);
    const year = Number(targetYear);

    const salesman = await salesmenService.getById(db, empId);
    const fullName = salesman
        ? `${salesman.firstname || ""} ${salesman.lastname || ""}`.trim()
        : `Employee ${empId}`;

    const records = await socialService.getBySid(db, empId);
    const filtered = records.filter(r => Number(r.year) <= year);

    const { total, breakdown } = calculateSocialBonus(filtered, year);

    return {
        employeeId: empId,
        fullName,
        year,
        socialBonus: total,
        breakdown
    };
};

// Create a proposal
exports.createSocialBonusProposal = async function (db, employeeId, targetYear, createdBy, remark) {

    const result = await exports.computeSocialBonus(db, employeeId, targetYear);

    const proposal = {
        type: "SOCIAL_BONUS",
        employeeId: result.employeeId,
        year: result.year,
        fullName: result.fullName,

        proposedValue: result.socialBonus,
        breakdown: result.breakdown,

        remark: remark || "",

        status: "PENDING",
        createdAt: new Date(),
        createdBy: createdBy || "unknown",
        decidedAt: null,
        decidedBy: null
    };


    const insertRes = await db.collection(PROPOSALS_COL).insertOne(proposal);

    return {
        proposalId: insertRes.insertedId.toString(),
        message: `Proposal created for ${result.fullName}: ${result.socialBonus}€ (${result.year}). Waiting for CEO approval.`,
        remark: proposal.remark,
        ...result,
        status: proposal.status
    };

};

// Retrieve a proposal by ID
exports.getProposalById = async function (db, proposalId) {
    return db.collection(PROPOSALS_COL).findOne({ _id: new mongodb.ObjectId(proposalId) });
};

// Approve proposal → only then store in OrangeHRM
exports.approveProposalAndStore = async function (db, proposalId, decidedBy) {
    const proposal = await exports.getProposalById(db, proposalId);
    if (!proposal) return { error: "NOT_FOUND" };

    if (proposal.status !== "PENDING") {
        return { error: "NOT_PENDING", status: proposal.status };
    }

    // Store in OrangeHRM (only on APPROVE)
    await orangehrmService.addBonusSalary(
        proposal.employeeId,
        proposal.year,
        proposal.proposedValue
    );

    // Update proposal status
    await db.collection(PROPOSALS_COL).updateOne(
        { _id: proposal._id },
        { $set: {
                status: "APPROVED",
                decidedAt: new Date(),
                decidedBy: decidedBy || "unknown"
            }}
    );

    return {
        proposalId,
        status: "APPROVED",
        message: `Approved and stored ${proposal.proposedValue}€ in OrangeHRM for ${proposal.fullName} (${proposal.year}).`,
        storedInOrangeHRM: true,
        employeeId: proposal.employeeId,
        fullName: proposal.fullName,
        year: proposal.year,
        value: proposal.proposedValue
    };
};

// Reject proposal → DO NOT store in OrangeHRM
exports.rejectProposal = async function (db, proposalId, decidedBy, reason) {
    const proposal = await exports.getProposalById(db, proposalId);
    if (!proposal) return { error: "NOT_FOUND" };

    if (proposal.status !== "PENDING") {
        return { error: "NOT_PENDING", status: proposal.status };
    }

    await db.collection(PROPOSALS_COL).updateOne(
        { _id: proposal._id },
        { $set: {
                status: "REJECTED",
                decidedAt: new Date(),
                decidedBy: decidedBy || "unknown",
                rejectReason: reason || ""
            }}
    );

    return {
        proposalId,
        status: "REJECTED",
        message: `Rejected proposal for ${proposal.fullName} (${proposal.year}). Nothing stored in OrangeHRM.`,
        storedInOrangeHRM: false,
        rejectReason: reason || ""
    };
};

exports.updateRemarks = async function (db, proposalId, remarks) {
    const result = await db.collection(PROPOSALS_COL).findOneAndUpdate(
        { _id: new mongodb.ObjectId(proposalId) },
        { $set: { remarks: remarks } },
        { returnDocument: "after" }
    );

    return result.value;
};

