const opencrxService = require("../services/opencrx-service");

exports.getAllAccounts = async function (req, res) {
    try {
        const accounts = await opencrxService.getAllAccounts();
        res.send(accounts);
    } catch (error) {
        console.error("OpenCRX getAllAccounts error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

exports.getAccountById = async function (req, res) {
    try {
        const id = req.params.id;
        const account = await opencrxService.getAccountById(id);

        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        res.send(account);
    } catch (error) {
        console.error("OpenCRX getAccountById error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};
