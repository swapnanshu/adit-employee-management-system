import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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

  getAll(): Observable<Employee[]> {
    return this.http
      .get<ApiResponse<Employee[]>>(this.apiUrl)
      .pipe(map((response) => response.data || []));
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
