import axios from "axios";
import {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
  ApiResponse,
} from "../types/company.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const companyService = {
  /**
   * Get all companies with optional filtering, sorting, and pagination
   */
  async getAll(
    params: {
      search?: string;
      industry?: string;
      sortBy?: string;
      sortOrder?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<ApiResponse<Company[]>> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.industry) queryParams.append("industry", params.industry);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.limit !== undefined)
      queryParams.append("limit", params.limit.toString());
    if (params.offset !== undefined)
      queryParams.append("offset", params.offset.toString());

    const url = `/companies${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiClient.get<ApiResponse<Company[]>>(url);
    return response.data;
  },

  /**
   * Get company by ID
   */
  async getById(id: string): Promise<Company> {
    const response = await apiClient.get<ApiResponse<Company>>(
      `/companies/${id}`
    );
    if (!response.data.data) {
      throw new Error("Company not found");
    }
    return response.data.data;
  },

  /**
   * Create new company
   */
  async create(data: CreateCompanyDto): Promise<Company> {
    const response = await apiClient.post<ApiResponse<Company>>(
      "/companies",
      data
    );
    if (!response.data.data) {
      throw new Error(response.data.error || "Failed to create company");
    }
    return response.data.data;
  },

  /**
   * Update company
   */
  async update(id: string, data: UpdateCompanyDto): Promise<Company> {
    const response = await apiClient.patch<ApiResponse<Company>>(
      `/companies/${id}`,
      data
    );
    if (!response.data.data) {
      throw new Error(response.data.error || "Failed to update company");
    }
    return response.data.data;
  },

  /**
   * Delete company
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/companies/${id}`);
  },
};
