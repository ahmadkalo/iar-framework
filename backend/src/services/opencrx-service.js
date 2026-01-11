const axios = require("axios");
const env = require("../../environments/environment.js");

const opencrxClient = axios.create({
    baseURL: env.OPENCRX_BASE_URL,
    auth: {
        username: env.OPENCRX_USERNAME,
        password: env.OPENCRX_PASSWORD
    },
    headers: {
        Accept: "application/json"
    }
});

let client = opencrxClient;

exports._setClient = function (newClient) {
    client = newClient;
};

exports._resetClient = function () {
    client = opencrxClient;
}

// Help function: extracts OpenCRX "objects"
function extractObjects(response) {
    if (response?.data?.objects) {
        return response.data.objects;
    }
    return [];
}

// GET all Accounts
exports.getAllAccounts = async function () {
    const response = await opencrxClient.get("/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account");
    return extractObjects(response);
};

// GET an Account by Id
exports.getAccountById = async function (id) {
    const response = await opencrxClient.get(
        `/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/${id}`
    );
    return response.data;
};


// GET all Sales Orders
exports.getAllSalesOrders = async function () {
    const response = await opencrxClient.get(
        "/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder"
    );

    const objects = response.data.objects || [];

    return objects.map(order => {
        const href = order["@href"];
        const id = href.split("/").pop();  // letzte Komponente extrahieren

        return {
            ...order,
            id: id
        };
    });
};


// GET Sales Order by ID
exports.getSalesOrderById = async function (id) {
    const response = await opencrxClient.get(
        `/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${id}`
    );

    return response.data;
};


// GET Positions of a Sales Order (Products, Quantities, Prices…)
exports.getSalesOrderPositions = async function (salesOrderId) {
    const response = await opencrxClient.get(
        `/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${salesOrderId}/position`
    );

    return response.data.objects || [];
};


// Get Products of a sales Order
exports.getProductsOfSalesOrder = async function (salesOrderId) {

    // 1. Load positions
    const positions = await exports.getSalesOrderPositions(salesOrderId);

    let products = [];

    // 2. Extract and load the product for each position.
    for (let pos of positions) {

        if (!pos.product || !pos.product['@href']) continue;

        const productHref = pos.product['@href'];
        const productId = productHref.split("/").pop();

        // Retrieve product data
        const response = await opencrxClient.get(
            `/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/${productId}`
        );

        products.push(response.data);
    }

    return products; // List of Sales Order Products
};
