const socialService = require("./socialPerformance-service");
const salesmenService = require("./salesmen-service");
const orangehrmService = require("./orangehrm-service");
const { calculateSocialBonus } = require("../utils/social-bonus");

exports.computeSocialBonus = async function (db, employeeId, targetYear) {
    const empId = Number(employeeId);
    const year = Number(targetYear);

    const salesman = await salesmenService.getById(db, empId);
    const fullName = salesman
        ? `${salesman.firstname || ""} ${salesman.lastname || ""}`.trim()
        : `Employee ${empId}`;

    const records = await socialService.getBySid(db, empId);
    const filtered = records.filter(r => Number(r.year) <= year);

    const { total, breakdown } = calculateSocialBonus(filtered, year);

    return {
        employeeId: empId,
        fullName,
        year,
        socialBonus: total,
        breakdown
    };
};

// ✅ NEU: Berechnen + in OrangeHRM speichern
exports.computeAndStoreSocialBonus = async function (db, employeeId, targetYear) {
    const result = await exports.computeSocialBonus(db, employeeId, targetYear);

    // ⭐ HIER ist der letzte Schritt: Speichern in OrangeHRM
    await orangehrmService.addBonusSalary(result.employeeId, result.year, result.socialBonus);

    return {
        message: `Stored social bonus of ${result.socialBonus}€ for ${result.fullName} in OrangeHRM for year ${result.year}.`,
        employee: {
            employeeId: result.employeeId,
            fullName: result.fullName
        },
        year: result.year,
        socialBonus: result.socialBonus,
        storedInOrangeHRM: true,
        breakdown: result.breakdown
    };
};
