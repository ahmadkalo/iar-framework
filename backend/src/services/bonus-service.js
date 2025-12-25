const socialService = require("./socialPerformance-service");
const salesmenService = require("./salesmen-service");
const { calculateSocialBonus } = require("../utils/social-bonus");

exports.computeSocialBonus = async function (db, employeeId, targetYear) {
    const empId = Number(employeeId);
    const year = Number(targetYear);

    // 1) Salesman aus MongoDB (Collection: salesmen)
    const salesman = await salesmenService.getById(db, empId);

    const fullName = salesman
        ? `${salesman.firstname || ""} ${salesman.lastname || ""}`.trim()
        : `Employee ${empId}`;

    // 2) SocialPerformances holen
    const records = await socialService.getBySid(db, empId);

    // optional: nur <= targetYear
    const filtered = records.filter(r => Number(r.year) <= year);

    // 3) Bonus berechnen
    const { total, breakdown } = calculateSocialBonus(filtered, year);

    // 4) Message für Postman
    const message = `The social performance of employee ${fullName} has a social bonus of ${total}€ for year ${year}.`;

    return {
        message,
        employee: {
            employeeId: empId,
            fullName: fullName
        },
        year,
        socialBonus: total,
        breakdown
    };
};
