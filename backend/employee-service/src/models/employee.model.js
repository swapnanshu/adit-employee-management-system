const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

/**
 * Employee Model
 * Handles all database operations for employees using raw SQL queries
 */
class EmployeeModel {
  /**
   * Find all employees with optional filtering, sorting, and pagination
   * @param {Object} options - Query options
   * @param {number} options.limit - Maximum number of records to return
   * @param {number} options.offset - Number of records to skip
   * @param {string} options.search - Search term for name or email
   * @param {string} options.company_id - Company filter
   * @param {string} options.role_id - Role filter
   * @param {string} options.sortBy - Column to sort by
   * @param {string} options.sortOrder - Sort order (ASC or DESC)
   * @returns {Promise<Array>} Array of employee objects
   */
  static async findAll({
    limit = 100,
    offset = 0,
    search = "",
    company_id = "",
    role_id = "",
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
    const allowedSortFields = [
      "first_name",
      "last_name",
      "email",
      "created_at",
      "updated_at",
    ];
    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";

    let query = `
      SELECT id, first_name, last_name, email, company_id, role_id, created_at, updated_at
      FROM employees
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (company_id) {
      query += ` AND company_id = ?`;
      params.push(company_id);
    }

    if (role_id) {
      query += ` AND role_id = ?`;
      params.push(role_id);
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
   * Find employee by ID
   * @param {string} id - Employee UUID
   * @returns {Promise<Object|null>} Employee object or null
   */
  static async findById(id) {
    const query = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        company_id, 
        role_id, 
        created_at, 
        updated_at
      FROM employees
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
   * Find employee by email
   * @param {string} email - Employee email
   * @returns {Promise<Object|null>} Employee object or null
   */
  static async findByEmail(email) {
    const query = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        company_id, 
        role_id, 
        created_at, 
        updated_at
      FROM employees
      WHERE email = ?
    `;

    try {
      const [rows] = await pool.execute(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find employees by company ID
   * @param {string} companyId - Company UUID
   * @returns {Promise<Array>} Array of employee objects
   */
  static async findByCompanyId(companyId) {
    const query = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        email, 
        company_id, 
        role_id, 
        created_at, 
        updated_at
      FROM employees
      WHERE company_id = ?
      ORDER BY created_at DESC
    `;

    try {
      const [rows] = await pool.execute(query, [companyId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new employee
   * @param {Object} employeeData - Employee data
   * @returns {Promise<Object>} Created employee object
   */
  static async create(employeeData) {
    const id = uuidv4();
    const query = `
      INSERT INTO employees 
        (id, first_name, last_name, email, company_id, role_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      await pool.execute(query, [
        id,
        employeeData.first_name,
        employeeData.last_name,
        employeeData.email,
        employeeData.company_id,
        employeeData.role_id,
      ]);

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update employee by ID
   * @param {string} id - Employee UUID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null>} Updated employee or null
   */
  static async update(id, updateData) {
    const allowedFields = [
      "first_name",
      "last_name",
      "email",
      "company_id",
      "role_id",
    ];
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
      UPDATE employees 
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
   * Delete employee by ID
   * @param {string} id - Employee UUID
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(id) {
    const query = "DELETE FROM employees WHERE id = ?";

    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get total count of employees with optional filtering
   * @param {Object} options - Filter options
   * @returns {Promise<number>} Total count
   */
  static async count({ search = "", company_id = "", role_id = "" } = {}) {
    let query = "SELECT COUNT(*) as total FROM employees WHERE 1=1";
    const params = [];

    if (search) {
      query += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    if (company_id) {
      query += ` AND company_id = ?`;
      params.push(company_id);
    }

    if (role_id) {
      query += ` AND role_id = ?`;
      params.push(role_id);
    }

    try {
      const [rows] = await pool.execute(query, params);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get employee distribution by role
   * @returns {Promise<Array>} Array of role stats { role_id: string, count: number }
   */
  static async getRoleStats() {
    const query = `
      SELECT 
        role_id, 
        COUNT(*) as count
      FROM employees
      GROUP BY role_id
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

module.exports = EmployeeModel;
