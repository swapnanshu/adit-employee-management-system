const EmployeeModel = require("../models/employee.model");
const httpClient = require("../utils/httpClient");

/**
 * Employee Business Logic Service
 * Handles inter-service communication and business rules
 */
class EmployeeService {
  /**
   * Validate that a company exists by calling Company Service
   * @param {string} companyId - Company UUID
   * @returns {Promise<boolean>} True if company exists
   * @throws {Error} If company doesn't exist or service is unavailable
   */
  static async validateCompanyExists(companyId) {
    try {
      const companyServiceUrl = process.env.COMPANY_SERVICE_URL;

      if (!companyServiceUrl) {
        console.warn(
          "⚠️ COMPANY_SERVICE_URL not configured, skipping validation"
        );
        return true; // Allow creation if service URL not configured
      }

      const response = await httpClient.get(
        `${companyServiceUrl}/companies/${companyId}`
      );

      if (response.status === 200 && response.data) {
        console.log(`✅ Company validation successful: ${companyId}`);
        return true;
      }

      return false;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Company with ID ${companyId} does not exist`);
      }

      // Log but don't fail if Company Service is down (graceful degradation)
      console.error("⚠️ Company Service unavailable:", error.message);
      console.warn(
        "⚠️ Proceeding without company validation (service unavailable)"
      );
      return true; // Graceful degradation
    }
  }

  /**
   * Validate that a role exists by calling Role Service
   * @param {string} roleId - Role UUID
   * @returns {Promise<boolean>} True if role exists
   * @throws {Error} If role doesn't exist or service is unavailable
   */
  static async validateRoleExists(roleId) {
    try {
      const roleServiceUrl = process.env.ROLE_SERVICE_URL;

      if (!roleServiceUrl) {
        console.warn("⚠️ ROLE_SERVICE_URL not configured, skipping validation");
        return true;
      }

      const response = await httpClient.get(
        `${roleServiceUrl}/roles/${roleId}`
      );

      if (response.status === 200 && response.data) {
        console.log(`✅ Role validation successful: ${roleId}`);
        return true;
      }

      return false;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error(`Role with ID ${roleId} does not exist`);
      }

      // Graceful degradation
      console.error("⚠️ Role Service unavailable:", error.message);
      console.warn(
        "⚠️ Proceeding without role validation (service unavailable)"
      );
      return true;
    }
  }

  /**
   * Get all employees with filtering and sorting
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Employees with pagination metadata
   */
  static async getAllEmployees(options = {}) {
    const {
      limit = 100,
      offset = 0,
      search = "",
      company_id = "",
      role_id = "",
      sortBy = "created_at",
      sortOrder = "DESC",
    } = options;

    const limitInt = parseInt(limit) || 100;
    const offsetInt = parseInt(offset) || 0;

    const employees = await EmployeeModel.findAll({
      limit: limitInt,
      offset: offsetInt,
      search,
      company_id,
      role_id,
      sortBy,
      sortOrder,
    });

    const total = await EmployeeModel.count({ search, company_id, role_id });

    return {
      data: employees,
      pagination: {
        total,
        limit: limitInt,
        offset: offsetInt,
        hasMore: offsetInt + limitInt < total,
      },
    };
  }

  /**
   * Get employee by ID
   * @param {string} id - Employee UUID
   * @returns {Promise<Object>} Employee object
   * @throws {Error} If employee not found
   */
  static async getEmployeeById(id) {
    const employee = await EmployeeModel.findById(id);

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  /**
   * Create new employee with validation
   * @param {Object} employeeData - Employee data
   * @returns {Promise<Object>} Created employee
   * @throws {Error} If validation fails
   */
  static async createEmployee(employeeData) {
    // Check if email already exists
    const existingEmployee = await EmployeeModel.findByEmail(
      employeeData.email
    );
    if (existingEmployee) {
      throw new Error("Employee with this email already exists");
    }

    // Validate company exists via inter-service call
    await this.validateCompanyExists(employeeData.company_id);

    // Validate role exists via inter-service call
    await this.validateRoleExists(employeeData.role_id);

    // Create employee
    const employee = await EmployeeModel.create(employeeData);

    return employee;
  }

  /**
   * Update employee
   * @param {string} id - Employee UUID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated employee
   * @throws {Error} If employee not found or validation fails
   */
  static async updateEmployee(id, updateData) {
    // Check if employee exists
    const existingEmployee = await EmployeeModel.findById(id);
    if (!existingEmployee) {
      throw new Error("Employee not found");
    }

    // If email is being updated, check uniqueness
    if (updateData.email && updateData.email !== existingEmployee.email) {
      const emailExists = await EmployeeModel.findByEmail(updateData.email);
      if (emailExists) {
        throw new Error("Employee with this email already exists");
      }
    }

    // Validate company if being updated
    if (updateData.company_id) {
      await this.validateCompanyExists(updateData.company_id);
    }

    // Validate role if being updated
    if (updateData.role_id) {
      await this.validateRoleExists(updateData.role_id);
    }

    // Update employee
    const updatedEmployee = await EmployeeModel.update(id, updateData);

    return updatedEmployee;
  }

  /**
   * Delete employee
   * @param {string} id - Employee UUID
   * @returns {Promise<boolean>} True if deleted
   * @throws {Error} If employee not found
   */
  static async deleteEmployee(id) {
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      throw new Error("Employee not found");
    }

    const deleted = await EmployeeModel.delete(id);
    return deleted;
  }

  /**
   * Get employees by company
   * @param {string} companyId - Company UUID
   * @returns {Promise<Array>} Array of employees
   */
  static async getEmployeesByCompany(companyId) {
    const employees = await EmployeeModel.findByCompanyId(companyId);
    return employees;
  }

  /**
   * Get employee distribution by role
   * Resolves role IDs to role titles by calling Role Service
   * @returns {Promise<Array>} Role stats with titles
   */
  static async getRoleStats() {
    const rawStats = await EmployeeModel.getRoleStats();

    try {
      const roleServiceUrl = process.env.ROLE_SERVICE_URL;
      if (!roleServiceUrl) {
        return rawStats.map((stat) => ({
          role: stat.role_id,
          count: stat.count,
        }));
      }

      // Fetch all roles to map IDs to titles
      const response = await httpClient.get(
        `${roleServiceUrl}/roles?limit=1000`
      );
      const roles = response.data.data;
      const roleMap = roles.reduce((acc, role) => {
        acc[role.id] = role.title;
        return acc;
      }, {});

      return rawStats.map((stat) => ({
        role: roleMap[stat.role_id] || "Unknown Role",
        count: stat.count,
      }));
    } catch (error) {
      console.error("⚠️ Error resolving role names for stats:", error.message);
      return rawStats.map((stat) => ({
        role: stat.role_id,
        count: stat.count,
      }));
    }
  }
}

module.exports = EmployeeService;
