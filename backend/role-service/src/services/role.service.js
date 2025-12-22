const RoleModel = require('../models/role.model');

/**
 * Role Business Logic Service
 */
class RoleService {
  /**
   * Get all roles
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Roles with pagination metadata
   */
  static async getAllRoles(options = {}) {
    const limit = parseInt(options.limit) || 100;
    const offset = parseInt(options.offset) || 0;

    const roles = await RoleModel.findAll(limit, offset);
    const total = await RoleModel.count();

    return {
      data: roles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  /**
   * Get role by ID
   * @param {string} id - Role UUID
   * @returns {Promise<Object>} Role object
   * @throws {Error} If role not found
   */
  static async getRoleById(id) {
    const role = await RoleModel.findById(id);
    
    if (!role) {
      throw new Error('Role not found');
    }
    
    return role;
  }

  /**
   * Create new role
   * @param {Object} roleData - Role data
   * @returns {Promise<Object>} Created role
   * @throws {Error} If validation fails
   */
  static async createRole(roleData) {
    // Check if role with same title already exists
    const existingRole = await RoleModel.findByTitle(roleData.title);
    if (existingRole) {
      throw new Error('Role with this title already exists');
    }

    const role = await RoleModel.create(roleData);
    
    return role;
  }

  /**
   * Update role
   * @param {string} id - Role UUID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated role
   * @throws {Error} If role not found or validation fails
   */
  static async updateRole(id, updateData) {
    // Check if role exists
    const existingRole = await RoleModel.findById(id);
    if (!existingRole) {
      throw new Error('Role not found');
    }

    // If title is being updated, check uniqueness
    if (updateData.title && updateData.title !== existingRole.title) {
      const titleExists = await RoleModel.findByTitle(updateData.title);
      if (titleExists) {
        throw new Error('Role with this title already exists');
      }
    }

    const updatedRole = await RoleModel.update(id, updateData);
    
    return updatedRole;
  }

  /**
   * Delete role
   * @param {string} id - Role UUID
   * @returns {Promise<boolean>} True if deleted
   * @throws {Error} If role not found
   */
  static async deleteRole(id) {
    const role = await RoleModel.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }

    const deleted = await RoleModel.delete(id);
    return deleted;
  }
}

module.exports = RoleService;
