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

        return response.data; // give back the access_token
    } catch (error) {
        console.error("OrangeHRM login error:", error.response?.data || error);
        throw new Error("Login failed");
    }
};

// GET all Employees
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

// GET an Employees by Id
exports.getEmployeeById = async function (id) {
    try {
        // 1. Get Access-Token
        const tokenResponse = await exports.login();
        const accessToken = tokenResponse.access_token;

        // 2. Request to OrangeHRM
        const url = `${env.ORANGEHRM_API_BASE_URL}/employee/${id}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        });

        // OrangeHRM usually stores the actual data in response.data.data
        return response.data.data ?? response.data;
    } catch (error) {
        console.error("OrangeHRM getEmployeeById error:", error.response?.data || error);
        throw new Error("Failed to fetch employee");
    }
};


// GET Bonus Salary
exports.getBonusSalary = async function (employeeId, year) {
    try {
        const tokenData = await exports.login();
        const accessToken = tokenData.access_token;

        const url = `${env.ORANGEHRM_API_BASE_URL}/employee/${employeeId}/bonussalary`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        });

        const allBonuses = response.data.data || response.data;

        // ➜ Filter out the year
        const filtered = allBonuses.filter(b => b.year == year);

        return filtered;
    } catch (error) {
        console.error("OrangeHRM getBonusSalary error:", error.response?.data || error);
        throw new Error("Failed to fetch bonus salary");
    }
};


// GET All Bonus Salaries
exports.getAllBonusSalaries = async function (employeeId) {
    try {
        const tokenData = await exports.login();
        const accessToken = tokenData.access_token;

        const url = `${env.ORANGEHRM_API_BASE_URL}/employee/${employeeId}/bonussalary`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("OrangeHRM getAllBonusSalaries error:", error.response?.data || error);
        throw new Error("Failed to fetch all bonus salaries");
    }
};


// POST Bonus Salary
exports.addBonusSalary = async function (employeeId, year, value) {
    try {
        const tokenData = await exports.login();
        const accessToken = tokenData.access_token;

        const url = `${env.ORANGEHRM_API_BASE_URL}/employee/${employeeId}/bonussalary`;

        const body = new URLSearchParams();
        body.append("year", String(year));
        body.append("value", String(value));

        const response = await axios.post(url, body.toString(), {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json"
            }
        });

        return response.data;
    } catch (error) {

        throw new Error("Failed to store bonus salary");
    }

};


// DELETE Bonus Salary
exports.deleteBonusSalary = async function (employeeId, year) {
    try {
        const tokenData = await exports.login();
        const accessToken = tokenData.access_token;

        const url = `${env.ORANGEHRM_API_BASE_URL}/employee/${employeeId}/bonussalary?year=${year}`;

        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("OrangeHRM deleteBonusSalary error:", error.response?.data || error);
        throw new Error("Failed to delete bonus salary");
    }
};

