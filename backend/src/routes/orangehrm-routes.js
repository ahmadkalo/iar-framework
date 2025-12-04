const express = require("express");
const router = express.Router();
const orangehrmApi = require("../apis/orangehrm-api");
/**
 * @swagger
 * tags:
 *   name: OrangeHRM
 *   description: Access to employees, bonus salaries and HRM authentication
 */

/**
 * @swagger
 * /orangehrm/login:
 *   get:
 *     summary: Request an OAuth access token from OrangeHRM
 *     description: Authenticates the backend against OrangeHRM and retrieves a Bearer token required for further API calls.
 *     tags: [OrangeHRM]
 *     responses:
 *       200:
 *         description: Access token successfully retrieved
 *       500:
 *         description: Authentication with OrangeHRM failed
 */
router.get("/login", orangehrmApi.login);


/**
 * @swagger
 * /orangehrm/employees:
 *   get:
 *     summary: Retrieve all employees from OrangeHRM
 *     description: Returns a list of all employee records available in the HRM system.
 *     tags: [OrangeHRM]
 *     responses:
 *       200:
 *         description: List of employees
 *       500:
 *         description: Failed to fetch employees
 */
router.get("/employees", orangehrmApi.getAllEmployees);


/**
 * @swagger
 * /orangehrm/employees/{id}:
 *   get:
 *     summary: Retrieve a specific employee by ID
 *     description: Returns detailed employee information for the given employee ID.
 *     tags: [OrangeHRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID in OrangeHRM
 *     responses:
 *       200:
 *         description: Employee data found
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error while fetching employee data
 */
router.get("/employees/:id", orangehrmApi.getEmployeeById);



/**
 * @swagger
 * /orangehrm/bonus/{id}/{year}:
 *   get:
 *     summary: Retrieve bonus salary for an employee for a specific year
 *     description: Filters all bonus records for a specific employee and returns only the ones matching the requested year.
 *     tags: [OrangeHRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: The year for the requested bonus salary
 *     responses:
 *       200:
 *         description: Bonus salary records for the given year
 *       500:
 *         description: Error fetching bonus salary
 */
router.get("/bonus/:id/:year", orangehrmApi.getBonus);


/**
 * @swagger
 * /orangehrm/bonus/all/{id}:
 *   get:
 *     summary: Retrieve all bonus salary entries for an employee
 *     description: Returns all bonus salary records stored for a given employee across all years.
 *     tags: [OrangeHRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: List of bonus salary entries
 *       500:
 *         description: Error fetching bonus salary records
 */
router.get("/bonus/:id", orangehrmApi.getAllBonus);



/**
 * @swagger
 * /orangehrm/bonus:
 *   post:
 *     summary: Add a new bonus salary entry
 *     description: Stores a new bonus salary (year + value) for an employee in OrangeHRM.
 *     tags: [OrangeHRM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               year:
 *                 type: integer
 *               value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bonus salary successfully stored
 *       500:
 *         description: Failed to store bonus salary
 */
router.post("/bonus", orangehrmApi.addBonus);


/**
 * @swagger
 * /orangehrm/bonus/{id}/{year}:
 *   delete:
 *     summary: Delete bonus salary entry for an employee for a given year
 *     description: Removes a bonus salary entry from OrangeHRM if present.
 *     tags: [OrangeHRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year for which the bonus entry should be removed
 *     responses:
 *       200:
 *         description: Bonus entry deleted
 *       500:
 *         description: Failed to delete bonus entry
 */
router.delete("/bonus/:id/:year", orangehrmApi.deleteBonus);

module.exports = router;
