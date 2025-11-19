const express = require('express');
const router = express.Router();
const { checkAuthorization } = require('../middlewares/auth-middleware');

/* -------------------------------
   AUTHENTICATION ENDPOINTS
--------------------------------*/
const authApi = require('../apis/auth-api');
router.post('/login', authApi.login);
router.delete('/login', checkAuthorization(), authApi.logout);
router.get('/login', authApi.isLoggedIn);

/* -------------------------------
   USER ENDPOINTS
--------------------------------*/
const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);

/* -------------------------------
   PEOPLE DEMO ENDPOINT
--------------------------------*/
const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people', checkAuthorization(), peopleDemoApi.getPeople);

/* -------------------------------
   SALESMEN ENDPOINTS
--------------------------------*/
const salesmenApi = require('../apis/salesmen-api');

// GET all salesmen
router.get('/salesmen', checkAuthorization(), salesmenApi.getAll);

// GET single salesman
router.get('/salesmen/:id', checkAuthorization(), salesmenApi.getById);

// POST new salesman (admin only)
router.post('/salesmen', checkAuthorization(true), salesmenApi.add);

// UPDATE salesman (admin only)
router.put('/salesmen/:id', checkAuthorization(true), salesmenApi.update);

// DELETE salesman (admin only)
router.delete('/salesmen/:id', checkAuthorization(true), salesmenApi.remove);

/* -------------------------------
   SOCIAL PERFORMANCE ENDPOINTS
--------------------------------*/
const socialApi = require('../apis/socialPerformance-api');

// GET all records
router.get('/socialPerformance', checkAuthorization(), socialApi.getAll);

// GET records for salesman
router.get('/socialPerformance/:sid', checkAuthorization(), socialApi.getBySid);

// POST new record (admin only)
router.post('/socialPerformance', checkAuthorization(true), socialApi.add);

// UPDATE record (admin only)
router.put('/socialPerformance/:sid/:category', checkAuthorization(true), socialApi.update);

// DELETE record (admin only)
router.delete('/socialPerformance/:sid/:category', checkAuthorization(true), socialApi.remove);

module.exports = router;
