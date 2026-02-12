const opencrxService = require("../services/opencrx-service");
const salesmenService = require("../services/salesmen-service");
// Accounts
exports.getAllAccounts = async function (req, res) {
    try {
        const accounts = await opencrxService.getAllAccounts();
        res.send(accounts);
    } catch (error) {
        console.error("OpenCRX getAllAccounts error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

exports.getAccountById = async function (req, res) {
    try {
        const id = req.params.id;
        const account = await opencrxService.getAccountById(id);

        if (!account) return res.status(404).send({ message: "Account not found" });
        res.send(account);
    } catch (error) {
        console.error("OpenCRX getAccountById error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

// Sales Orders
exports.getAllSalesOrders = async function (req, res) {
    try {
        const orders = await opencrxService.getAllSalesOrders();
        res.send(orders);
    } catch (error) {
        console.error("OpenCRX getAllSalesOrders error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

exports.getSalesOrderById = async function (req, res) {
    try {
        const order = await opencrxService.getSalesOrderById(req.params.id);
        res.send(order);
    } catch (error) {
        console.error("OpenCRX getSalesOrderById error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

exports.getSalesOrderPositions = async function (req, res) {
    try {
        const positions = await opencrxService.getSalesOrderPositions(req.params.id);
        res.send(positions);
    } catch (error) {
        console.error("OpenCRX getSalesOrderPositions error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

exports.getProductsOfSalesOrder = async function (req, res) {
    try {
        const products = await opencrxService.getProductsOfSalesOrder(req.params.id);
        res.send(products);
    } catch (err) {
        console.error("OpenCRX getProductsOfSalesOrder error:", err);
        res.status(500).send({ error: "Failed to fetch products" });
    }
};

// ✅ Order evaluation for bonus calculation
// GET /api/opencrx/salesmen/:employeeId/orders-evaluation?year=2025
exports.getOrdersEvaluationForSalesman = async function (req, res) {
    try {
        const { employeeId } = req.params;
        const year = req.query.year;

        const result = await opencrxService.getOrdersEvaluationForSalesman(employeeId, year);
        res.send(result);
    } catch (err) {
        console.error("OpenCRX getOrdersEvaluationForSalesman error:", err);
        res.status(500).send({ error: "Failed to evaluate orders" });
    }
};

// ✅ Raw sales orders for salesman (debug)
exports.getSalesOrdersForSalesman = async function (req, res) {
    try {
        const { employeeId } = req.params;
        const year = req.query.year;

        const result = await opencrxService.getSalesOrdersForSalesman(employeeId, year);
        res.send(result);
    } catch (err) {
        console.error("OpenCRX getSalesOrdersForSalesman error:", err);
        res.status(500).send({ error: "Failed to fetch sales orders for salesman" });
    }
};

// ✅ Mapping employeeId -> opencrx internalId
exports.getSalesmanMapping = async function (req, res) {
    try {
        const { employeeId } = req.params;
        const result = await opencrxService.getSalesmanMapping(employeeId);
        res.send(result);
    } catch (err) {
        console.error("OpenCRX getSalesmanMapping error:", err);
        res.status(500).send({ error: "Failed to map employeeId to OpenCRX id" });
    }

};

