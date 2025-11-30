const environment = {
    production: false,
    port: 8080,
    defaultAdminPassword: '5$c3inw%',
    db: {
        host: '127.0.0.1',
        port: 27017,
        username: '',
        password: '',
        authSource: 'admin',
        name: 'intArch'
    },
    corsOrigins: ['http://localhost:4200'],

    // --- OpenCRX ---
    OPENCRX_BASE_URL: "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX",
    OPENCRX_USERNAME: "guest",
    OPENCRX_PASSWORD: "guest",

    // --- OrangeHRM ---
    ORANGEHRM_TOKEN_URL: "https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/oauth/issueToken",
    ORANGEHRM_API_BASE_URL: "https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1",

    ORANGEHRM_CLIENT_ID: "api_oauth_id",
    ORANGEHRM_CLIENT_SECRET: "oauth_secret",
    ORANGEHRM_USERNAME: "demouser",
    ORANGEHRM_PASSWORD: "*Safb02da42Demo$"
};

module.exports = environment;
