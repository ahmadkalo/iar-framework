/*
    This file acts as the entrypoint for node.js
 */

const express = require('express');
const cookieSession = require('cookie-session');
const multer = require('multer');
const upload = multer();
const crypto = require('crypto');
const cors = require('cors');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const app = express();   //

// --- ROUTES ---
const opencrxRoutes = require("./routes/opencrx-routes");
app.use("/api/opencrx", opencrxRoutes);

const orangehrmRoutes = require("./routes/orangehrm-routes");
app.use("/api/orangehrm", orangehrmRoutes);



// --- ENVIRONMENT ---
let environment;
if(process.env.NODE_ENV === 'development'){
    environment = require('../environments/environment.js').default;
}else{
    environment = require('../environments/environment.prod.js').default;
}

app.set('environment', environment);

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(upload.array());

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

// --- DEFAULT API ROUTES ---
const apiRouter = require('./routes/api-routes');
app.use('/api', apiRouter);

// --- DB ---
let db_credentials = '';
if(environment.db.username){
    db_credentials = environment.db.username+':'+environment.db.password+'@';
}

MongoClient.connect(
    'mongodb://' + db_credentials + environment.db.host + ':' + environment.db.port + '/?authSource='+environment.db.authSource
).then(async dbo => {
    const db = dbo.db(environment.db.name);
    await initDb(db);
    app.set('db',db);

    app.listen(environment.port, () => {
        console.log('Webserver started.');
    });
});

async function initDb(db){
    if(await db.collection('users').count() < 1){
        const userService = require('./services/user-service');
        const User = require("./models/User");

        const adminPassword = environment.defaultAdminPassword;
        await userService.add(db, new User('admin', '', 'admin', '', adminPassword, true));

        console.log('created admin user with password: '+adminPassword);
    }
}
