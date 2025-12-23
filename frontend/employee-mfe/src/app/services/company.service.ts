import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, map } from "rxjs";
import { Company, ApiResponse } from "../models/employee.model";

@Injectable({
  providedIn: "root",
})
export class CompanyService {
  private apiUrl = `${environment.companyServiceUrl}/companies`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Company[]> {
    return this.http
      .get<ApiResponse<Company[]>>(this.apiUrl)
      .pipe(map((response) => response.data || []));
  }
}
