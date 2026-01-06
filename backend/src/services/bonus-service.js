const socialService = require("./socialPerformance-service");
const salesmenService = require("./salesmen-service");
const orangehrmService = require("./orangehrm-service");
const { calculateSocialBonus } = require("../utils/social-bonus");
const mongodb = require("mongodb");

// Collection-Name für Proposals
const PROPOSALS_COL = "bonusProposals";

// Bestehende Berechnung (wie bei dir) — nur als Beispiel:
// Du kannst deine aktuelle computeSocialBonus behalten und nur nutzen.
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

// ✅ NEU: Proposal erstellen (statt direkt speichern)
exports.createSocialBonusProposal = async function (db, employeeId, targetYear, createdBy) {
    const result = await exports.computeSocialBonus(db, employeeId, targetYear);

    const proposal = {
        type: "SOCIAL_BONUS",
        employeeId: result.employeeId,
        year: result.year,
        fullName: result.fullName,

        proposedValue: result.socialBonus,
        breakdown: result.breakdown,

        status: "PENDING",          // PENDING | APPROVED | REJECTED
        createdAt: new Date(),
        createdBy: createdBy || "unknown",
        decidedAt: null,
        decidedBy: null
    };

    const insertRes = await db.collection(PROPOSALS_COL).insertOne(proposal);

    return {
        proposalId: insertRes.insertedId.toString(),
        message: `Proposal created for ${result.fullName}: ${result.socialBonus}€ (${result.year}). Waiting for CEO approval.`,
        ...result,
        status: proposal.status
    };
};

// ✅ NEU: Proposal abrufen
exports.getProposalById = async function (db, proposalId) {
    return db.collection(PROPOSALS_COL).findOne({ _id: new mongodb.ObjectId(proposalId) });
};

// ✅ NEU: Proposal genehmigen → erst dann OrangeHRM speichern
exports.approveProposalAndStore = async function (db, proposalId, decidedBy) {
    const proposal = await exports.getProposalById(db, proposalId);
    if (!proposal) return { error: "NOT_FOUND" };

    if (proposal.status !== "PENDING") {
        return { error: "NOT_PENDING", status: proposal.status };
    }

    // ⭐ Speichern in OrangeHRM (nur bei APPROVE)
    await orangehrmService.addBonusSalary(proposal.employeeId, proposal.year, proposal.proposedValue);

    // Proposal-Status updaten
    await db.collection(PROPOSALS_COL).updateOne(
        { _id: proposal._id },
        { $set: { status: "APPROVED", decidedAt: new Date(), decidedBy: decidedBy || "unknown" } }
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

// ✅ NEU: Proposal ablehnen → NICHT speichern
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
            }
        }
    );

    return {
        proposalId,
        status: "REJECTED",
        message: `Rejected proposal for ${proposal.fullName} (${proposal.year}). Nothing stored in OrangeHRM.`,
        storedInOrangeHRM: false,
        rejectReason: reason || ""
    };
};
