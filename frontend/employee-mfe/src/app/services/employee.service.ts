import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, map } from "rxjs";
import {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ApiResponse,
} from "../models/employee.model";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private apiUrl = `${environment.employeeServiceUrl}/employees`;

  constructor(private http: HttpClient) {}

  getAll(
    params: {
      search?: string;
      company_id?: string;
      role_id?: string;
      sortBy?: string;
      sortOrder?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Observable<ApiResponse<Employee[]>> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set("search", params.search);
    if (params.company_id)
      httpParams = httpParams.set("company_id", params.company_id);
    if (params.role_id) httpParams = httpParams.set("role_id", params.role_id);
    if (params.sortBy) httpParams = httpParams.set("sortBy", params.sortBy);
    if (params.sortOrder)
      httpParams = httpParams.set("sortOrder", params.sortOrder);
    if (params.limit !== undefined)
      httpParams = httpParams.set("limit", params.limit.toString());
    if (params.offset !== undefined)
      httpParams = httpParams.set("offset", params.offset.toString());

    return this.http.get<ApiResponse<Employee[]>>(this.apiUrl, {
      params: httpParams,
    });
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.data) {
          throw new Error("Employee not found");
        }
        return response.data;
      })
    );
  }

  create(data: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, data).pipe(
      map((response) => {
        if (!response.data) {
          throw new Error(response.error || "Failed to create employee");
        }
        return response.data;
      })
    );
  }

  update(id: string, data: UpdateEmployeeDto): Observable<Employee> {
    return this.http
      .patch<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, data)
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error(response.error || "Failed to update employee");
          }
          return response.data;
        })
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
