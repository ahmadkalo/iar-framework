const orangehrmService = require("../services/orangehrm-service");

exports.login = async function (req, res) {
    try {
        const token = await orangehrmService.login();
        res.send(token);
    } catch (err) {
        res.status(500).send({ error: "OrangeHRM login failed" });
    }
};
