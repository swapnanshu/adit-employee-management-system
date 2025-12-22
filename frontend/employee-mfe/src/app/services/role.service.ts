import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Role, ApiResponse } from "../models/employee.model";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private apiUrl = "http://localhost:3003/api/v1/roles";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Role[]> {
    return this.http
      .get<ApiResponse<Role[]>>(this.apiUrl)
      .pipe(map((response) => response.data || []));
  }
}
