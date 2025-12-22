export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
  role_id: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
}

export interface Role {
  id: string;
  title: string;
  description: string;
}

export interface CreateEmployeeDto {
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
  role_id: string;
}

export interface UpdateEmployeeDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  company_id?: string;
  role_id?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
