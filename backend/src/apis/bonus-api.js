const bonusService = require("../services/bonus-service");

exports.createSocialBonusProposal = async (req, res) => {
    try {
        const db = req.app.get("db");
        const { employeeId, year } = req.params;

        // Wer erstellt? (aus Session, wenn vorhanden)
        const createdBy = req.session?.user?.username;

        const result = await bonusService.createSocialBonusProposal(db, employeeId, year, createdBy);
        res.status(201).send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Failed to create proposal" });
    }
};

exports.getProposal = async (req, res) => {
    try {
        const db = req.app.get("db");
        const { proposalId } = req.params;

        const proposal = await bonusService.getProposalById(db, proposalId);
        if (!proposal) return res.status(404).send({ message: "Proposal not found" });

        res.send(proposal);
    } catch (e) {
        res.status(500).send({ error: "Failed to fetch proposal" });
    }
};

exports.approveProposal = async (req, res) => {
    try {
        const db = req.app.get("db");
        const { proposalId } = req.params;
        const decidedBy = req.session?.user?.username;

        const result = await bonusService.approveProposalAndStore(db, proposalId, decidedBy);

        if (result.error === "NOT_FOUND") return res.status(404).send({ message: "Proposal not found" });
        if (result.error === "NOT_PENDING") return res.status(409).send({ message: "Proposal not pending", status: result.status });

        res.send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Failed to approve/store proposal" });
    }
};

exports.rejectProposal = async (req, res) => {
    try {
        const db = req.app.get("db");
        const { proposalId } = req.params;
        const decidedBy = req.session?.user?.username;
        const reason = req.body?.reason;

        const result = await bonusService.rejectProposal(db, proposalId, decidedBy, reason);

        if (result.error === "NOT_FOUND") return res.status(404).send({ message: "Proposal not found" });
        if (result.error === "NOT_PENDING") return res.status(409).send({ message: "Proposal not pending", status: result.status });

        res.send(result);
    } catch (e) {
        res.status(500).send({ error: "Failed to reject proposal" });
    }
};
