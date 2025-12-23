const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/company.controller");
const { validate } = require("../middleware/validation.middleware");

/**
 * Company Routes
 * All routes are prefixed with /api/v1/companies
 */

// GET /api/v1/companies - Get all companies
router.get("/", CompanyController.getAllCompanies);

// GET /api/v1/companies/stats/industry - Get industry distribution stats
// Note: This must be before the /:id route
router.get("/stats/industry", CompanyController.getIndustryStats);

// GET /api/v1/companies/:id - Get company by ID
router.get(
  "/:id",
  validate("uuidParam", "params"),
  CompanyController.getCompanyById
);

// POST /api/v1/companies - Create new company
router.post("/", validate("createCompany"), CompanyController.createCompany);

// PATCH /api/v1/companies/:id - Update company
router.patch(
  "/:id",
  validate("uuidParam", "params"),
  validate("updateCompany"),
  CompanyController.updateCompany
);

// DELETE /api/v1/companies/:id - Delete company
router.delete(
  "/:id",
  validate("uuidParam", "params"),
  CompanyController.deleteCompany
);

module.exports = router;
