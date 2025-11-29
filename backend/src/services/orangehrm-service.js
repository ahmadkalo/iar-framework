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
