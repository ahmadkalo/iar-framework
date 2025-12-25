class Employee {
    constructor(employeeId, firstname, lastname, fullName, department) {
        this._id = undefined;
        this.employeeId = employeeId;
        this.firstname = firstname || "";
        this.lastname = lastname || "";
        this.fullName = fullName || "";
        this.department = department || "";
        this.syncedAt = new Date();
    }
}

module.exports = Employee;
