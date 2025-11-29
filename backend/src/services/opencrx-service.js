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

// Hilfsfunktion: extrahiert OpenCRX "objects"
function extractObjects(response) {
    if (response?.data?.objects) {
        return response.data.objects;
    }
    return [];
}

exports.getAllAccounts = async function () {
    const response = await opencrxClient.get("/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account");
    return extractObjects(response);
};

exports.getAccountById = async function (id) {
    const response = await opencrxClient.get(
        `/org.opencrx.kernel.account1/provider/CRX/segment/Standard/account/${id}`
    );
    return response.data;
};
