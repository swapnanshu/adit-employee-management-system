const CompanyService = require("../services/company.service");

/**
 * Company Controller
 * Handles HTTP requests and responses for company endpoints
 */
class CompanyController {
  /**
   * Get all companies
   * @route GET /api/v1/companies
   */
  static async getAllCompanies(req, res, next) {
    try {
      console.log(req.query);
      const { limit, offset } = req.query;

      const result = await CompanyService.getAllCompanies({ limit, offset });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get company by ID
   * @route GET /api/v1/companies/:id
   */
  static async getCompanyById(req, res, next) {
    try {
      const { id } = req.params;

      const company = await CompanyService.getCompanyById(id);

      res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new company
   * @route POST /api/v1/companies
   */
  static async createCompany(req, res, next) {
    try {
      const companyData = req.body;

      const company = await CompanyService.createCompany(companyData);

      res.status(201).json({
        success: true,
        message: "Company created successfully",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update company
   * @route PATCH /api/v1/companies/:id
   */
  static async updateCompany(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const company = await CompanyService.updateCompany(id, updateData);

      res.status(200).json({
        success: true,
        message: "Company updated successfully",
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete company
   * @route DELETE /api/v1/companies/:id
   */
  static async deleteCompany(req, res, next) {
    try {
      const { id } = req.params;

      await CompanyService.deleteCompany(id);

      res.status(200).json({
        success: true,
        message: "Company deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get company industry distribution stats
   * @route GET /api/v1/companies/stats/industry
   */
  static async getIndustryStats(req, res, next) {
    try {
      const stats = await CompanyService.getIndustryStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompanyController;
