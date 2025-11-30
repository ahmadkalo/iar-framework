const orangehrmService = require("../services/orangehrm-service");

exports.login = async function (req, res) {
    try {
        const token = await orangehrmService.login();
        res.send(token);
    } catch (err) {
        res.status(500).send({ error: "OrangeHRM login failed" });
    }
};

exports.getAllEmployees = async function (req, res) {
    try {
        const employees = await orangehrmService.getAllEmployees();
        res.send(employees);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch employees" });
    }
};


exports.getEmployeeById = async function (req, res) {
    try {
        const id = req.params.id;
        const employee = await orangehrmService.getEmployeeById(id);

        if (!employee) {
            return res.status(404).send({ message: "Employee not found" });
        }

        res.send(employee);
    } catch (err) {
        console.error("OrangeHRM getEmployeeById error:", err);
        res.status(500).send({ error: "Failed to fetch employee" });
    }
};
