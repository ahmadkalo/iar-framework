const orangehrmService = require("../services/orangehrm-service");
const employeeService = require("../services/employee-service");
const Employee = require("../models/Employee");

exports.syncEmployeeFromOrangeHrm = async function (req, res) {
    try {
        const db = req.app.get("db");
        const employeeId = parseInt(req.params.id);

        // 1) Aus OrangeHRM holen
        const hrmEmployee = await orangehrmService.getEmployeeById(employeeId);

        if (!hrmEmployee) {
            return res.status(404).send({ message: "Employee not found in OrangeHRM" });
        }


        const fullName = hrmEmployee.fullName || hrmEmployee.full_name || "";
        const firstName =
            hrmEmployee.firstName || hrmEmployee.first_name || hrmEmployee.firstname || "";
        const lastName =
            hrmEmployee.lastName || hrmEmployee.last_name || hrmEmployee.lastname || "";


        const department = hrmEmployee.department?.name || hrmEmployee.department || "";

        const employee = new Employee(employeeId, firstName, lastName, fullName, department);

        // 3) In MongoDB speichern (upsert)
        const stored = await employeeService.upsertFromOrangeHrm(db, employee);

        res.status(200).send({
            message: "Employee synced to MongoDB",
            employee: stored
        });
    } catch (err) {
        console.error("syncEmployeeFromOrangeHrm error:", err);
        res.status(500).send({ error: "Failed to sync employee" });
    }
};

exports.getEmployee = async function (req, res) {
    const db = req.app.get("db");
    const employeeId = parseInt(req.params.id);
    const emp = await employeeService.getByEmployeeId(db, employeeId);
    if (!emp) return res.status(404).send({ message: "Employee not found in MongoDB" });
    res.send(emp);
};

exports.getAllEmployees = async function (req, res) {
    const db = req.app.get("db");
    res.send(await employeeService.getAll(db));
};
