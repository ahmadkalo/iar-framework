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


// GET Bonus Salary
exports.getBonus = async function (req, res) {
    try {
        const { id, year } = req.params;
        const result = await orangehrmService.getBonusSalary(id, year);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch bonus salary" });
    }
};

// GET All Bonus
exports.getAllBonus = async function (req, res) {
    try {
        const { id } = req.params;
        const bonuses = await orangehrmService.getAllBonus(id);

        res.status(200).send(bonuses);

    } catch (err) {
        res.status(500).send({ error: "Failed to fetch all bonus salaries" });
    }
};


// POST Bonus Salary
exports.addBonus = async function (req, res) {
    try {
        const { employeeId, year, value } = req.body;
        console.log("Parsed:", employeeId, year, value);

        const result = await orangehrmService.addBonusSalary(employeeId, year, value);

        res.send(result);

    } catch (err) {
        console.error("ROUTE ERROR:", err);
        res.status(500).send({ error: "Failed to store bonus salary" });
    }
};


// DELETE Bonus Salary
exports.deleteBonus = async function (req, res) {
    try {
        const { id, year } = req.params;
        const result = await orangehrmService.deleteBonusSalary(id, year);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: "Failed to delete bonus salary" });
    }
};
