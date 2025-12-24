const EmployeeService = require("../services/employee.service");

/**
 * Employee Controller
 * Handles HTTP requests and responses for employee endpoints
 */
class EmployeeController {
  /**
   * Get all employees
   * @route GET /api/v1/employees
   */
  static async getAllEmployees(req, res, next) {
    try {
      const { limit, offset, search, company_id, role_id, sortBy, sortOrder } =
        req.query;

      const result = await EmployeeService.getAllEmployees({
        limit,
        offset,
        search,
        company_id,
        role_id,
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
   * Get employee by ID
   * @route GET /api/v1/employees/:id
   */
  static async getEmployeeById(req, res, next) {
    try {
      const { id } = req.params;

      const employee = await EmployeeService.getEmployeeById(id);

      res.status(200).json({
        success: true,
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new employee
   * @route POST /api/v1/employees
   */
  static async createEmployee(req, res, next) {
    try {
      const employeeData = req.body;

      const employee = await EmployeeService.createEmployee(employeeData);

      res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update employee
   * @route PATCH /api/v1/employees/:id
   */
  static async updateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const employee = await EmployeeService.updateEmployee(id, updateData);

      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: employee,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete employee
   * @route DELETE /api/v1/employees/:id
   */
  static async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;

      await EmployeeService.deleteEmployee(id);

      res.status(200).json({
        success: true,
        message: "Employee deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get employees by company
   * @route GET /api/v1/employees/company/:companyId
   */
  static async getEmployeesByCompany(req, res, next) {
    try {
      const { companyId } = req.params;

      const employees = await EmployeeService.getEmployeesByCompany(companyId);

      res.status(200).json({
        success: true,
        data: employees,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get employee distribution by role stats
   * @route GET /api/v1/employees/stats/roles
   */
  static async getRoleStats(req, res, next) {
    try {
      const stats = await EmployeeService.getRoleStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmployeeController;
