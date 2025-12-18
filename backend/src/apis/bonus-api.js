const bonusService = require("../services/bonus-service");

exports.computeBonus = async (req, res) => {
    const db = req.app.get("db");
    const { employeeId, year } = req.params;

    const result = await bonusService.computeBonus(db, employeeId, year);

    res.send(result);
};
