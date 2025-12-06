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
 * /orangehrm/bonus/{id}:
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

/**
 * @swagger
 * /orangehrm/employees/{id}/work-experience:
 *   get:
 *     summary: Get all work experience records of an employee
 *     description: Returns all stored work experience entries for the specified employee.
 *     tags: [OrangeHRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID in OrangeHRM
 *     responses:
 *       200:
 *         description: List of work experience entries
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error while fetching work experience from OrangeHRM
 */
router.get("/employees/:id/work-experience", orangehrmApi.getWorkExperience);

/**
 * @swagger
 * /orangehrm/employees/{id}/work-experience:
 *   post:
 *     summary: Add a new work experience entry for an employee
 *     description: Creates a new work experience record inside OrangeHRM and returns the assigned seqId.
 *     tags: [OrangeHRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID in OrangeHRM
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               company:
 *                 type: string
 *               title:
 *                 type: string
 *               fromDate:
 *                 type: string
 *                 example: "2003-03-01"
 *               toDate:
 *                 type: string
 *                 example: "2006-03-01"
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Work experience successfully added
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Error while saving work experience into OrangeHRM
 */
router.post("/employees/:id/work-experience", orangehrmApi.addWorkExperience);

/**
 * @swagger
 * /orangehrm/employees/{id}/work-experience:
 *   delete:
 *     summary: Delete a specific work experience record
 *     description: Deletes a work experience entry for a given employee.
 *                  The seqId must be passed as a query parameter.
 *     tags: [OrangeHRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID in OrangeHRM
 *       - in: query
 *         name: seqId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sequence ID of the work experience entry to delete
 *     responses:
 *       200:
 *         description: Work experience entry deleted successfully
 *       404:
 *         description: Employee or work experience entry not found
 *       500:
 *         description: Error while deleting the work experience entry
 */

router.delete("/employees/:id/work-experience", orangehrmApi.deleteWorkExperience);




module.exports = router;
