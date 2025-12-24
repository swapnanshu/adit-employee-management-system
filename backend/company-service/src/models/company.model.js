const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

/**
 * Company Model
 * Handles all database operations for companies using raw SQL queries
 */
class CompanyModel {
  /**
   * Find all companies with optional filtering, sorting, and pagination
   * @param {Object} options - Query options
   * @param {number} options.limit - Maximum number of records to return
   * @param {number} options.offset - Number of records to skip
   * @param {string} options.search - Search term for company name
   * @param {string} options.industry - Industry filter
   * @param {string} options.sortBy - Column to sort by
   * @param {string} options.sortOrder - Sort order (ASC or DESC)
   * @returns {Promise<Array>} Array of company objects
   */
  static async findAll({
    limit = 100,
    offset = 0,
    search = "",
    industry = "",
    sortBy = "created_at",
    sortOrder = "DESC",
  } = {}) {
    // Ensure parameters are integers to prevent SQL injection
    const limitInt = parseInt(limit, 10) || 100;
    const offsetInt = parseInt(offset, 10) || 0;

    // Validate sort order
    const order =
      typeof sortOrder === "string" && sortOrder.toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";

    // Whitelist allowed sort columns
    const allowedSortFields = ["name", "industry", "created_at"];
    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";

    let query = `
      SELECT id, name, industry, created_at, updated_at
      FROM companies
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (industry) {
      query += ` AND industry = ?`;
      params.push(industry);
    }

    query += `
      ORDER BY ${sortField} ${order}
      LIMIT ${limitInt} OFFSET ${offsetInt}
    `;

    try {
      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find company by ID
   * @param {string} id - Company UUID
   * @returns {Promise<Object|null>} Company object or null
   */
  static async findById(id) {
    const query = `
      SELECT 
        id, 
        name, 
        industry, 
        created_at, 
        updated_at
      FROM companies
      WHERE id = ?
    `;

    try {
      const [rows] = await pool.execute(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find company by name
   * @param {string} name - Company name
   * @returns {Promise<Object|null>} Company object or null
   */
  static async findByName(name) {
    const query = `
      SELECT 
        id, 
        name, 
        industry, 
        created_at, 
        updated_at
      FROM companies
      WHERE name = ?
    `;

    try {
      const [rows] = await pool.execute(query, [name]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new company
   * @param {Object} companyData - Company data
   * @returns {Promise<Object>} Created company object
   */
  static async create(companyData) {
    const id = uuidv4();
    const query = `
      INSERT INTO companies 
        (id, name, industry)
      VALUES (?, ?, ?)
    `;

    try {
      await pool.execute(query, [id, companyData.name, companyData.industry]);

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update company by ID
   * @param {string} id - Company UUID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null>} Updated company or null
   */
  static async update(id, updateData) {
    const allowedFields = ["name", "industry"];
    const updates = [];
    const values = [];

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (updates.length === 0) {
      return await this.findById(id);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    const query = `
      UPDATE companies 
      SET ${updates.join(", ")}
      WHERE id = ?
    `;

    try {
      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete company by ID
   * @param {string} id - Company UUID
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(id) {
    const query = "DELETE FROM companies WHERE id = ?";

    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get total count of companies with optional filtering
   * @param {Object} options - Filter options
   * @returns {Promise<number>} Total count
   */
  static async count({ search = "", industry = "" } = {}) {
    let query = "SELECT COUNT(*) as total FROM companies WHERE 1=1";
    const params = [];

    if (search) {
      query += ` AND name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (industry) {
      query += ` AND industry = ?`;
      params.push(industry);
    }

    try {
      const [rows] = await pool.execute(query, params);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get company distribution by industry
   * @returns {Promise<Array>} Array of industry stats { industry: string, count: number }
   */
  static async getIndustryStats() {
    const query = `
      SELECT 
        industry, 
        COUNT(*) as count
      FROM companies
      GROUP BY industry
      ORDER BY count DESC
    `;

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CompanyModel;
