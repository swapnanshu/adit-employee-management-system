const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/employee.controller");
const { validate } = require("../middleware/validation.middleware");

/**
 * Employee Routes
 * All routes are prefixed with /api/v1/employees
 */

// GET /api/v1/employees - Get all employees
router.get("/", EmployeeController.getAllEmployees);

// GET /api/v1/employees/stats/roles - Get role distribution stats
// Note: This must be before the /:id route
router.get("/stats/roles", EmployeeController.getRoleStats);

// GET /api/v1/employees/company/:companyId - Get employees by company
router.get(
  "/company/:companyId",
  validate("uuidParam", "params"),
  EmployeeController.getEmployeesByCompany
);

// GET /api/v1/employees/:id - Get employee by ID
router.get(
  "/:id",
  validate("uuidParam", "params"),
  EmployeeController.getEmployeeById
);

// POST /api/v1/employees - Create new employee
router.post("/", validate("createEmployee"), EmployeeController.createEmployee);

// PATCH /api/v1/employees/:id - Update employee
router.patch(
  "/:id",
  validate("uuidParam", "params"),
  validate("updateEmployee"),
  EmployeeController.updateEmployee
);

// DELETE /api/v1/employees/:id - Delete employee
router.delete(
  "/:id",
  validate("uuidParam", "params"),
  EmployeeController.deleteEmployee
);

module.exports = router;
