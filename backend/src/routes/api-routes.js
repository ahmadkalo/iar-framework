const express = require('express');
const router = express.Router();
const { checkAuthorization } = require('../middlewares/auth-middleware');

const authApi = require('../apis/auth-api');
const userApi = require('../apis/user-api');
const salesmenApi = require('../apis/salesmen-api');
const socialApi = require('../apis/socialPerformance-api');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Login & Session Management
 *   - name: User
 *   - name: Salesmen
 *   - name: SocialPerformance
 */

//
// AUTH
//

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Login failed
 */
router.post('/login', authApi.login);

/**
 * @swagger
 * /api/login:
 *   delete:
 *     tags: [Auth]
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.delete('/login', checkAuthorization(), authApi.logout);

/**
 * @swagger
 * /api/login:
 *   get:
 *     tags: [Auth]
 *     summary: Check if user is logged in
 *     responses:
 *       200:
 *         description: Login status
 */
router.get('/login', authApi.isLoggedIn);

//
// USER SELF
//

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [User]
 *     summary: Get currently logged-in user
 *     responses:
 *       200:
 *         description: User info
 */
router.get('/user', checkAuthorization(), userApi.getSelf);



//
// SALESMEN
//

/**
 * @swagger
 * /api/salesmen:
 *   get:
 *     tags: [Salesmen]
 *     summary: Get all salesmen
 */
router.get('/salesmen', checkAuthorization(), salesmenApi.getAll);

/**
 * @swagger
 * /api/salesmen/{id}:
 *   get:
 *     tags: [Salesmen]
 *     summary: Get salesman by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 */
router.get('/salesmen/:id', checkAuthorization(), salesmenApi.getById);

/**
 * @swagger
 * /api/salesmen:
 *   post:
 *     tags: [Salesmen]
 *     summary: Add new salesman (ADMIN ONLY)
 */
router.post('/salesmen', checkAuthorization(true), salesmenApi.add);

/**
 * @swagger
 * /api/salesmen/{id}:
 *   put:
 *     tags: [Salesmen]
 *     summary: Update salesman (ADMIN ONLY)
 */
router.put('/salesmen/:id', checkAuthorization(true), salesmenApi.update);

/**
 * @swagger
 * /api/salesmen/{id}:
 *   delete:
 *     tags: [Salesmen]
 *     summary: Delete salesman (ADMIN ONLY)
 */
router.delete('/salesmen/:id', checkAuthorization(true), salesmenApi.remove);

//
// SOCIAL PERFORMANCE
//

/**
 * @swagger
 * /api/socialPerformance:
 *   get:
 *     tags: [SocialPerformance]
 *     summary: Get all social performance entries
 */
router.get('/socialPerformance', checkAuthorization(), socialApi.getAll);

/**
 * @swagger
 * /api/socialPerformance/{sid}:
 *   get:
 *     tags: [SocialPerformance]
 *     summary: Get records for a specific salesman
 */
router.get('/socialPerformance/:sid', checkAuthorization(), socialApi.getBySid);

/**
 * @swagger
 * /api/socialPerformance:
 *   post:
 *     tags: [SocialPerformance]
 *     summary: Add new social performance record (ADMIN ONLY)
 */
router.post('/socialPerformance', checkAuthorization(true), socialApi.add);

/**
 * @swagger
 * /api/socialPerformance/{sid}/{category}:
 *   put:
 *     tags: [SocialPerformance]
 *     summary: Update performance record (ADMIN ONLY)
 */
router.put('/socialPerformance/:sid/:category', checkAuthorization(true), socialApi.update);

/**
 * @swagger
 * /api/socialPerformance/{sid}/{category}:
 *   delete:
 *     tags: [SocialPerformance]
 *     summary: Delete performance record (ADMIN ONLY)
 */
router.delete('/socialPerformance/:sid/:category', checkAuthorization(true), socialApi.remove);

module.exports = router;
