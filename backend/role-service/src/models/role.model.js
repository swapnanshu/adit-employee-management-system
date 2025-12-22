const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

/**
 * Role Model
 * Handles all database operations for roles using raw SQL queries
 */
class RoleModel {
  /**
   * Find all roles with optional pagination
   * @param {number} limit - Maximum number of records to return
   * @param {number} offset - Number of records to skip
   * @returns {Promise<Array>} Array of role objects
   */
  static async findAll(limit = 100, offset = 0) {
    // Ensure parameters are integers to prevent SQL injection
    const limitInt = parseInt(limit, 10) || 100;
    const offsetInt = parseInt(offset, 10) || 0;

    // Build query with LIMIT/OFFSET directly (safe because values are validated integers)
    const query = `
      SELECT 
        id, 
        title, 
        description, 
        created_at, 
        updated_at
      FROM roles
      ORDER BY created_at DESC
      LIMIT ${limitInt} OFFSET ${offsetInt}
    `;

    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find role by ID
   * @param {string} id - Role UUID
   * @returns {Promise<Object|null>} Role object or null
   */
  static async findById(id) {
    const query = `
      SELECT 
        id, 
        title, 
        description, 
        created_at, 
        updated_at
      FROM roles
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
   * Find role by title
   * @param {string} title - Role title
   * @returns {Promise<Object|null>} Role object or null
   */
  static async findByTitle(title) {
    const query = `
      SELECT 
        id, 
        title, 
        description, 
        created_at, 
        updated_at
      FROM roles
      WHERE title = ?
    `;

    try {
      const [rows] = await pool.execute(query, [title]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new role
   * @param {Object} roleData - Role data
   * @returns {Promise<Object>} Created role object
   */
  static async create(roleData) {
    const id = uuidv4();
    const query = `
      INSERT INTO roles 
        (id, title, description)
      VALUES (?, ?, ?)
    `;

    try {
      await pool.execute(query, [id, roleData.title, roleData.description]);

      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update role by ID
   * @param {string} id - Role UUID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null>} Updated role or null
   */
  static async update(id, updateData) {
    const allowedFields = ["title", "description"];
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
      UPDATE roles 
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
   * Delete role by ID
   * @param {string} id - Role UUID
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(id) {
    const query = "DELETE FROM roles WHERE id = ?";

    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get total count of roles
   * @returns {Promise<number>} Total count
   */
  static async count() {
    const query = "SELECT COUNT(*) as total FROM roles";

    try {
      const [rows] = await pool.execute(query);
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RoleModel;
