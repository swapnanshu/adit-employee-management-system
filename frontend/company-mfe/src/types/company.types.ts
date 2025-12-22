export interface Company {
  id: string;
  name: string;
  industry: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyDto {
  name: string;
  industry: string;
}

export interface UpdateCompanyDto {
  name?: string;
  industry?: string;
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
