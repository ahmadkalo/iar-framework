const axios = require("axios");
const env = require("../../environments/environment.js");

const opencrxClient = axios.create({
    baseURL: env.OPENCRX_BASE_URL,
    auth: { username: env.OPENCRX_USERNAME, password: env.OPENCRX_PASSWORD },
    headers: { Accept: "application/json" }
});

// ✅ injectable client for tests
let client = opencrxClient;
exports._setClient = (newClient) => (client = newClient);
exports._resetClient = () => (client = opencrxClient);

// ----------------- helpers -----------------
function extractObjects(response) {
    return response?.data?.objects ? response.data.objects : [];
}

function idFromRef(ref) {
    // ref may be: string, { "@href": "..." }, { "$": "..." }
    if (!ref) return null;
    if (typeof ref === "string") return ref.split("/").pop();
    const href = ref["@href"] || ref["$"] || ref.href;
    if (!href || typeof href !== "string") return null;
    return href.split("/").pop();
}

function idFromIdentity(obj) {
    // sometimes there is "identity": "xri://.../account/<id>"
    if (!obj) return null;
    if (obj.identity && typeof obj.identity === "string") return obj.identity.split("/").pop();
    if (obj["@href"] && typeof obj["@href"] === "string") return obj["@href"].split("/").pop();
    return null;
}

// ----------------- caching (like your friend) -----------------
let __govIdToInternalIdCache = null;
let __govIdCacheExpiresAt = 0;
const GOV_CACHE_TTL = 5 * 60 * 1000;

async function getInternalAccountIdByGovernmentId(employeeId) {
    const now = Date.now();
    if (!__govIdToInternalIdCache || now > __govIdCacheExpiresAt) {
        const response = await client.get(
            "/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account?size=200"
        );
        const list = extractObjects(response);

        const map = new Map();
        for (const acc of list) {
            const govId = String(acc.governmentId ?? "");
            if (!govId) continue;
            const internalId = idFromIdentity(acc);
            if (internalId) map.set(govId, internalId);
        }
        __govIdToInternalIdCache = map;
        __govIdCacheExpiresAt = now + GOV_CACHE_TTL;
    }

    const internal = __govIdToInternalIdCache.get(String(employeeId));
    if (!internal) throw new Error(`Account with governmentId=${employeeId} not found in OpenCRX.`);
    return internal;
}

// ----------------- existing simple endpoints (fixed to use client) -----------------
exports.getAllAccounts = async function () {
    const response = await client.get("/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account?size=200");
    return extractObjects(response);
};

exports.getAccountById = async function (id) {
    const response = await client.get(`/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/${id}`);
    return response.data;
};

exports.getAllSalesOrders = async function () {
    const response = await client.get("/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder?size=200");
    const objects = extractObjects(response);

    return objects.map((order) => {
        const href = order["@href"];
        const id = href ? href.split("/").pop() : idFromIdentity(order);
        return { ...order, id };
    });
};

exports.getSalesOrderById = async function (id) {
    const response = await client.get(`/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${id}`);
    return response.data;
};

exports.getSalesOrderPositions = async function (salesOrderId) {
    const response = await client.get(
        `/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder/${salesOrderId}/position?size=200`
    );
    return extractObjects(response);
};

exports.getProductsOfSalesOrder = async function (salesOrderId) {
    const positions = await exports.getSalesOrderPositions(salesOrderId);
    const products = [];

    for (const pos of positions) {
        const productId = idFromRef(pos.product);
        if (!productId) continue;

        const response = await client.get(
            `/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product/${productId}`
        );
        products.push(response.data);
    }
    return products;
};

// ----------------- NEW: Leads + Products -----------------
exports.getAllLeads = async function () {
    const response = await client.get("/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/lead?size=200");
    return extractObjects(response);
};

async function getAllProductsSlimMap() {
    const response = await client.get("/org.opencrx.kernel.product1/provider/CRX/segment/Standard/product?size=200");
    const objs = extractObjects(response);
    const map = new Map();
    for (const p of objs) {
        const id = idFromIdentity(p);
        if (id) map.set(id, p.name);
    }
    return map;
}

async function getLeadsByCustomerMap() {
    const leads = await exports.getAllLeads();
    const map = new Map();

    for (const lead of leads) {
        const customerId = idFromRef(lead.customer);
        if (!customerId) continue;
        const prob =
            lead.closeProbability ??
            lead.closedProbability ??
            lead.probability ??
            0;
        map.set(customerId, Number(prob) || 0);
    }
    return map;
}

// ----------------- NEW: fetch ALL sales orders with pagination -----------------
async function getAllSalesOrdersPaged() {
    const batch = 50;
    let start = 0;
    let hasMore = true;
    const all = [];

    while (hasMore) {
        const response = await client.get(
            `/org.opencrx.kernel.contract1/provider/CRX/segment/Standard/salesOrder?position=${start}&size=${batch}`
        );
        const objs = extractObjects(response);
        if (objs.length === 0) break;

        all.push(...objs);

        if (response.data?.["@hasMore"] !== "true") hasMore = false;
        start += batch;
    }

    return all.map((order) => ({
        ...order,
        id: idFromIdentity(order)
    }));
}

// ----------------- NEW: Order evaluation for a salesman -----------------
exports.getOrdersEvaluationForSalesman = async function (employeeId, year) {
    const empId = String(employeeId);
    const yearNum = year ? Number(year) : null;

    // resolve internal salesman id via governmentId mapping (fallback to employeeId if not found)
    let internalSalesRepId = null;
    try {
        internalSalesRepId = await getInternalAccountIdByGovernmentId(empId);
    } catch (_) {
        internalSalesRepId = null;
    }

    const orders = await getAllSalesOrdersPaged();

    // filter orders by salesRep
    const filtered = orders.filter((o) => {
        const salesRepId = idFromRef(o.salesRep); // salesRep is typical in OpenCRX
        if (!salesRepId) return false;
        return salesRepId === empId || (internalSalesRepId && salesRepId === internalSalesRepId);
    });

    // filter by year (activeOn, createdAt)
    const filteredByYear = !yearNum
        ? filtered
        : filtered.filter((o) => {
            const d = o.activeOn || o.createdAt || o.modifiedAt;
            if (!d) return false;
            const y = new Date(d).getFullYear();
            return y === yearNum;
        });

    // prefetch product names + leads
    const [productMap, leadMap] = await Promise.all([
        getAllProductsSlimMap(),
        getLeadsByCustomerMap()
    ]);

    // customer cache (account fetch)
    const customerCache = new Map();
    async function getCustomer(customerId) {
        if (!customerId) return null;
        if (customerCache.has(customerId)) return customerCache.get(customerId);

        const p = client
            .get(`/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/${customerId}`)
            .then((r) => r.data)
            .catch(() => null);

        customerCache.set(customerId, p);
        return p;
    }

    const rows = [];

    for (const order of filteredByYear) {
        const salesOrderId = order.id;
        const customerId = idFromRef(order.customer);
        const customer = await getCustomer(customerId);

        const clientName = customer?.name || customer?.fullName || customer?.lastname || "N/A";
        const clientRanking = customer?.accountRating || customer?.rating || "N/A";

        // probability from leadMap, fallback from order itself
        const closeProbability =
            (customerId && leadMap.get(customerId)) ||
            Number(order.closeProbability || 0);

        // positions -> items + products
        const positions = await exports.getSalesOrderPositions(salesOrderId).catch(() => []);
        const items = positions.reduce((sum, p) => sum + Number(p.quantity || 0), 0);

        // choose product name(s)
        const productNames = [];
        for (const pos of positions) {
            const pid = idFromRef(pos.product);
            const pname = pid ? productMap.get(pid) : null;
            if (pname) productNames.push(pname);
        }
        const uniqueProducts = [...new Set(productNames)];
        const product = uniqueProducts.length > 0 ? uniqueProducts.join(", ") : "N/A";

        rows.push({
            salesOrderId,
            activeOn: order.activeOn || null,
            product,
            client: clientName,
            clientRanking,
            closeProbability,
            items
        });
    }

    const itemsTotal = rows.reduce((s, r) => s + (Number(r.items) || 0), 0);

    return {
        employeeId: Number(employeeId),
        year: yearNum,
        itemsTotal,
        orders: rows
    };
};

// ----------------- NEW: raw salesorders for salesman (debug) -----------------
exports.getSalesOrdersForSalesman = async function (employeeId, year) {
    const evaluation = await exports.getOrdersEvaluationForSalesman(employeeId, year);
    // return less processed view (still filtered by salesman/year)
    return evaluation.orders.map((r) => ({
        salesOrderId: r.salesOrderId,
        activeOn: r.activeOn,
        items: r.items,
        client: r.client
    }));
};

// ----------------- NEW: mapping endpoint helper -----------------
exports.getSalesmanMapping = async function (employeeId) {
    const internalId = await getInternalAccountIdByGovernmentId(employeeId);
    return { employeeId: Number(employeeId), opencrxInternalId: internalId };
};

exports.resetCache = function () {
    __govIdToInternalIdCache = null;
    __govIdCacheExpiresAt = 0;
};
