const RoleService = require("../services/role.service");

/**
 * Role Controller
 * Handles HTTP requests and responses for role endpoints
 */
class RoleController {
  /**
   * Get all roles
   * @route GET /api/v1/roles
   */
  static async getAllRoles(req, res, next) {
    try {
      const { limit, offset, search, sortBy, sortOrder } = req.query;

      const result = await RoleService.getAllRoles({
        limit,
        offset,
        search,
        sortBy,
        sortOrder,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get role by ID
   * @route GET /api/v1/roles/:id
   */
  static async getRoleById(req, res, next) {
    try {
      const { id } = req.params;

      const role = await RoleService.getRoleById(id);

      res.status(200).json({
        success: true,
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new role
   * @route POST /api/v1/roles
   */
  static async createRole(req, res, next) {
    try {
      const roleData = req.body;

      const role = await RoleService.createRole(roleData);

      res.status(201).json({
        success: true,
        message: "Role created successfully",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update role
   * @route PATCH /api/v1/roles/:id
   */
  static async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const role = await RoleService.updateRole(id, updateData);

      res.status(200).json({
        success: true,
        message: "Role updated successfully",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete role
   * @route DELETE /api/v1/roles/:id
   */
  static async deleteRole(req, res, next) {
    try {
      const { id } = req.params;

      await RoleService.deleteRole(id);

      res.status(200).json({
        success: true,
        message: "Role deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoleController;
