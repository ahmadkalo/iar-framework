const socialService = require("./socialPerformance-service");
const opencrxService = require("./opencrx-service");
const orangehrmService = require("./orangehrm-service");

const { calculateSocialBonus } = require("../utils/social-bonus");
const { calculateOrderBonus } = require("../utils/order-bonus");

exports.computeBonus = async function (db, employeeId, year) {

    // 1. Stammdaten (nur zur Anzeige / Prüfung)
    const employee = await orangehrmService.getEmployeeById(employeeId);

    // 2. Social Performance
    const socialRecords = await socialService.getBySid(db, employeeId);
    const socialBonus = calculateSocialBonus(
        socialRecords.filter(r => r.year == year)
    );

    // 3. Order Bonus (vereinfacht)
    const salesOrders = await opencrxService.getAllSalesOrders();
    let products = [];

    for (let o of salesOrders) {
        const orderProducts = await opencrxService.getProductsOfSalesOrder(o.id);
        products.push(...orderProducts);
    }

    const orderBonus = calculateOrderBonus(products);

    const totalBonus = socialBonus + orderBonus;

    return {
        employee,
        year,
        socialBonus,
        orderBonus,
        totalBonus
    };


};
