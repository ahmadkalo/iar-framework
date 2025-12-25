exports.upsertFromOrangeHrm = async function (db, employee) {
    db.collection("salesmen").findOneAndUpdate(
        { id: employee.employeeId },
        { $set: {
                id: employee.employeeId,
                firstname: employee.firstname,
                lastname: employee.lastname,
                fullName: employee.fullName,
                syncedAt: new Date()
            }},
        { upsert: true, returnDocument: "after" }
    );

};

exports.getByEmployeeId = async function (db, employeeId) {
    return db.collection("employees").findOne({ employeeId });
};

exports.getAll = async function (db) {
    return db.collection("employees").find().toArray();
};
