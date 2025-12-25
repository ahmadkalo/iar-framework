const express = require('express');
const cookieSession = require('cookie-session');
const multer = require('multer');
const upload = multer();
const crypto = require('crypto');
const cors = require('cors');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const app = express();


//  ENVIRONMENT CONFIG
let environment;
if (process.env.NODE_ENV === 'development') {
    environment = require('../environments/environment.js');
} else {
    environment = require('../environments/environment.prod.js');
}
app.set('environment', environment);


//  Swagger SETUP
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SmartHoover API",
            version: "1.0.0",
            description: "API documentation for SmartHoover Integration",
        },
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const fs = require("fs");
fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
console.log("Swagger JSON generated: swagger.json");



//  MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  SESSIONS
app.use(cookieSession({
    secret: crypto.randomBytes(32).toString('hex'),
    sameSite: false,
    secure: false,
    httpOnly: false
}));

app.use(cors({
    origin: environment.corsOrigins,
    credentials: true
}));

//  ROUTES
const opencrxRoutes = require("./routes/opencrx-routes");
app.use("/api/opencrx", opencrxRoutes);

const orangehrmRoutes = require("./routes/orangehrm-routes");
app.use("/api/orangehrm", orangehrmRoutes);

const apiRouter = require('./routes/api-routes');
app.use('/api', apiRouter);

const employeeRoutes = require("./routes/employee-routes");
app.use("/api", employeeRoutes);

const bonusRoutes = require("./routes/bonus-routes");
app.use("/api", bonusRoutes);


//  DATABASE INIT
let db_credentials = '';
if (environment.db.username) {
    db_credentials = environment.db.username + ':' + environment.db.password + '@';
}

MongoClient.connect(
    'mongodb://' + db_credentials + environment.db.host + ':' + environment.db.port + '/?authSource=' + environment.db.authSource
).then(async dbo => {
    const db = dbo.db(environment.db.name);
    await initDb(db);
    app.set('db', db);

    app.listen(environment.port, () => {
        console.log('Webserver started.');
    });
});


//  INIT DEFAULT ADMIN USER
async function initDb(db) {
    if (await db.collection('users').count() < 1) {
        const userService = require('./services/user-service');
        const User = require("./models/User");

        const adminPassword = environment.defaultAdminPassword;
        await userService.add(db, new User('admin', '', 'admin', '', adminPassword, true));

        console.log('created admin user with password: ' + adminPassword);
    }
}
