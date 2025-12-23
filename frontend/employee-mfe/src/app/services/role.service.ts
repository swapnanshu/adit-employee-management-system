import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, map } from "rxjs";
import { Role, ApiResponse } from "../models/employee.model";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  private apiUrl = `${environment.roleServiceUrl}/roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Role[]> {
    return this.http
      .get<ApiResponse<Role[]>>(this.apiUrl)
      .pipe(map((response) => response.data || []));
  }
}
