const bonusService = require("../services/bonus-service");

exports.computeSocialBonus = async (req, res) => {
    try {
        const db = req.app.get("db");
        const { employeeId, year } = req.params;

        const result = await bonusService.computeSocialBonus(db, employeeId, year);
        res.send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: "Failed to compute social bonus" });
    }
};
