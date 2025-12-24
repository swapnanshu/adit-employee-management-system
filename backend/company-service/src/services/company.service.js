const CompanyModel = require("../models/company.model");

/**
 * Company Business Logic Service
 */
class CompanyService {
  /**
   * Get all companies with filtering and sorting
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Companies with pagination metadata
   */
  static async getAllCompanies(options = {}) {
    const {
      limit = 100,
      offset = 0,
      search = "",
      industry = "",
      sortBy = "created_at",
      sortOrder = "DESC",
    } = options;

    const limitInt = parseInt(limit) || 100;
    const offsetInt = parseInt(offset) || 0;

    const companies = await CompanyModel.findAll({
      limit: limitInt,
      offset: offsetInt,
      search,
      industry,
      sortBy,
      sortOrder,
    });

    const total = await CompanyModel.count({ search, industry });

    return {
      data: companies,
      pagination: {
        total,
        limit: limitInt,
        offset: offsetInt,
        hasMore: offsetInt + limitInt < total,
      },
    };
  }

  /**
   * Get company by ID
   * @param {string} id - Company UUID
   * @returns {Promise<Object>} Company object
   * @throws {Error} If company not found
   */
  static async getCompanyById(id) {
    const company = await CompanyModel.findById(id);

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  }

  /**
   * Create new company
   * @param {Object} companyData - Company data
   * @returns {Promise<Object>} Created company
   * @throws {Error} If validation fails
   */
  static async createCompany(companyData) {
    // Check if company with same name already exists
    const existingCompany = await CompanyModel.findByName(companyData.name);
    if (existingCompany) {
      throw new Error("Company with this name already exists");
    }

    const company = await CompanyModel.create(companyData);

    return company;
  }

  /**
   * Update company
   * @param {string} id - Company UUID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated company
   * @throws {Error} If company not found or validation fails
   */
  static async updateCompany(id, updateData) {
    // Check if company exists
    const existingCompany = await CompanyModel.findById(id);
    if (!existingCompany) {
      throw new Error("Company not found");
    }

    // If name is being updated, check uniqueness
    if (updateData.name && updateData.name !== existingCompany.name) {
      const nameExists = await CompanyModel.findByName(updateData.name);
      if (nameExists) {
        throw new Error("Company with this name already exists");
      }
    }

    const updatedCompany = await CompanyModel.update(id, updateData);

    return updatedCompany;
  }

  /**
   * Delete company
   * @param {string} id - Company UUID
   * @returns {Promise<boolean>} True if deleted
   * @throws {Error} If company not found
   */
  static async deleteCompany(id) {
    const company = await CompanyModel.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }

    const deleted = await CompanyModel.delete(id);
    return deleted;
  }

  /**
   * Get company industry distribution stats
   * @returns {Promise<Array>} Industry stats
   */
  static async getIndustryStats() {
    return await CompanyModel.getIndustryStats();
  }
}

module.exports = CompanyService;
