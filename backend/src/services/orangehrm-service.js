const axios = require("axios");
const env = require("../../environments/environment");

exports.login = async function () {
    try {
        const body = new URLSearchParams({
            client_id: env.ORANGEHRM_CLIENT_ID,
            client_secret: env.ORANGEHRM_CLIENT_SECRET,
            grant_type: "password",
            username: env.ORANGEHRM_USERNAME,
            password: env.ORANGEHRM_PASSWORD
        });

        const response = await axios.post(
            env.ORANGEHRM_TOKEN_URL,
            body.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json"
                }
            }
        );

        return response.data; // access_token zurückgeben
    } catch (error) {
        console.error("OrangeHRM login error:", error.response?.data || error);
        throw new Error("Login failed");
    }
};


exports.getAllEmployees = async function () {
    try {
        const tokenData = await exports.login();
        const accessToken = tokenData.access_token;

        const response = await axios.get(
            `${env.ORANGEHRM_API_BASE_URL}/employee/search`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("OrangeHRM getAllEmployees error:", error.response?.data || error);
        throw new Error("Failed to fetch employees");
    }
};

exports.getEmployeeById = async function (id) {
    try {
        // 1. Access-Token holen (wie bei getAllEmployees)
        const tokenResponse = await exports.login();
        const accessToken = tokenResponse.access_token;

        // 2. Request an OrangeHRM
        const url = `${env.ORANGEHRM_API_BASE_URL}/employee/${id}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        });

        // OrangeHRM steckt die eigentlichen Daten meist in response.data.data
        return response.data.data ?? response.data;
    } catch (error) {
        console.error("OrangeHRM getEmployeeById error:", error.response?.data || error);
        throw new Error("Failed to fetch employee");
    }
};

