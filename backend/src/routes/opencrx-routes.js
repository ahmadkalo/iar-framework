const express = require("express");
const router = express.Router();
const opencrxApi = require("../apis/opencrx-api");

/**
 * @swagger
 * tags:
 *   name: OpenCRX
 *   description: Access to CRM accounts, sales orders and related CRM data
 */

/**
 * @swagger
 * /opencrx/accounts:
 *   get:
 *     summary: Retrieve all accounts from OpenCRX
 *     description: Returns a list of all CRM accounts available in the OpenCRX system.
 *     tags: [OpenCRX]
 *     responses:
 *       200:
 *         description: A list of CRM accounts
 *       500:
 *         description: Error while communicating with OpenCRX
 */
router.get("/accounts", opencrxApi.getAllAccounts);

/**
 * @swagger
 * /opencrx/accounts/{id}:
 *   get:
 *     summary: Retrieve a specific CRM account by ID
 *     description: Fetches detailed account information from OpenCRX by its unique identifier (UUID).
 *     tags: [OpenCRX]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: OpenCRX account UUID
 *     responses:
 *       200:
 *         description: CRM account data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Error while communicating with OpenCRX
 */
router.get("/accounts/:id", opencrxApi.getAccountById);

/**
 * @swagger
 * /opencrx/salesorders:
 *   get:
 *     summary: Retrieve all sales orders
 *     description: Returns all sales orders stored in OpenCRX.
 *     tags: [OpenCRX]
 *     responses:
 *       200:
 *         description: List of sales orders
 *       500:
 *         description: Error while communicating with OpenCRX
 */
router.get("/salesorders", opencrxApi.getAllSalesOrders);

/**
 * @swagger
 * /opencrx/salesorders/{id}:
 *   get:
 *     summary: Retrieve a sales order by ID
 *     description: Fetches a specific sales order from OpenCRX using its unique UUID.
 *     tags: [OpenCRX]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales order UUID
 *     responses:
 *       200:
 *         description: Sales order data
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error while communicating with OpenCRX
 */
router.get("/salesorders/:id", opencrxApi.getSalesOrderById);

/**
 * @swagger
 * /opencrx/salesorders/{id}/positions:
 *   get:
 *     summary: Retrieve all line items (positions) of a sales order
 *     description: Returns all positions belonging to a sales order, including product references, quantity and pricing.
 *     tags: [OpenCRX]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales order UUID
 *     responses:
 *       200:
 *         description: List of sales order positions
 *       404:
 *         description: Sales order or positions not found
 *       500:
 *         description: Error while communicating with OpenCRX
 */
router.get("/salesorders/:id/positions", opencrxApi.getSalesOrderPositions);

/**
 * @swagger
 * /opencrx/salesorders/{id}/products:
 *   get:
 *     summary: Retrieve all products referenced by the positions of a sales order
 *     description: Loads every product associated with the line items of a sales order. Useful for bonus calculation or product analytics.
 *     tags: [OpenCRX]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sales order UUID
 *     responses:
 *       200:
 *         description: List of product objects of the sales order
 *       404:
 *         description: Sales order or products not found
 *       500:
 *         description: Error while communicating with OpenCRX
 */
router.get("/salesorders/:id/products", opencrxApi.getProductsOfSalesOrder);

module.exports = router;
