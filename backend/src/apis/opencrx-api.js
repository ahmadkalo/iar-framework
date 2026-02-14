const opencrxService = require("../services/opencrx-service");

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

        if (!account) {
            return res.status(404).send({ message: "Account not found" });
        }

        res.send(account);
    } catch (error) {
        console.error("OpenCRX getAccountById error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

// GET all sales orders
exports.getAllSalesOrders = async function (req, res) {
    try {
        const orders = await opencrxService.getAllSalesOrders();
        res.send(orders);
    } catch (error) {
        console.error("OpenCRX getAllSalesOrders error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

// GET sales order by ID
exports.getSalesOrderById = async function (req, res) {
    try {
        const order = await opencrxService.getSalesOrderById(req.params.id);
        res.send(order);
    } catch (error) {
        console.error("OpenCRX getSalesOrderById error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

// GET positions for a sales order (products & quantities)
exports.getSalesOrderPositions = async function (req, res) {
    try {
        const positions = await opencrxService.getSalesOrderPositions(req.params.id);
        res.send(positions);
    } catch (error) {
        console.error("OpenCRX getSalesOrderPositions error:", error);
        res.status(500).send({ error: "OpenCRX error" });
    }
};

// Get Products of a sales Order
exports.getProductsOfSalesOrder = async function (req, res) {
    try {
        const id = req.params.id;
        const products = await opencrxService.getProductsOfSalesOrder(id);
        res.send(products);
    } catch (err) {
        console.error("OpenCRX getProductsOfSalesOrder error:", err);
        res.status(500).send({ error: "Failed to fetch products" });
    }
};
