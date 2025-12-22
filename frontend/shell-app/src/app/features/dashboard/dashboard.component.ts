import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  route: string;
}

interface ApiResponse {
  success: boolean;
  pagination?: {
    total: number;
  };
  data?: any[];
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p class="text-slate-600 mt-1">Welcome to Office Management System</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        @for (stat of stats; track stat.title) {
        <div
          [routerLink]="stat.route"
          class="card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">{{ stat.title }}</p>
              <div class="flex items-center mt-2">
                @if (loading) {
                <div class="h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
                } @else {
                <p class="text-3xl font-bold" [class]="stat.color">
                  {{ stat.value }}
                </p>
                }
              </div>
            </div>
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              [class]="stat.color + ' bg-opacity-10'"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  [attr.d]="stat.icon"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h2 class="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            routerLink="/employees"
            class="text-left p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </div>
              <div>
                <div class="font-medium text-slate-900">Add New Employee</div>
                <div class="text-sm text-slate-500">
                  Create new employee record
                </div>
              </div>
            </div>
          </button>

          <button
            routerLink="/companies"
            class="text-left p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </div>
              <div>
                <div class="font-medium text-slate-900">Add New Company</div>
                <div class="text-sm text-slate-500">Register a new company</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats: StatCard[] = [
    {
      title: "Total Companies",
      value: "0",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      color: "text-primary-600",
      route: "/companies",
    },
    {
      title: "Total Employees",
      value: "0",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      color: "text-emerald-600",
      route: "/employees",
    },
    {
      title: "Active Roles",
      value: "0",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.0 1M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      color: "text-amber-600",
      route: "/employees",
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;

    // Fetch counts from all 3 services in parallel
    forkJoin({
      companies: this.http.get<ApiResponse>(
        `http://localhost:3001/api/v1/companies?limit=1`
      ),
      employees: this.http.get<ApiResponse>(
        `http://localhost:3002/api/v1/employees?limit=1`
      ),
      roles: this.http.get<ApiResponse>(
        `http://localhost:3003/api/v1/roles?limit=1`
      ),
    }).subscribe({
      next: (results) => {
        this.stats[0].value = (
          results.companies.pagination?.total || 0
        ).toString();
        this.stats[1].value = (
          results.employees.pagination?.total || 0
        ).toString();
        this.stats[2].value = (results.roles.pagination?.total || 0).toString();
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading dashboard stats:", err);
        this.loading = false;
      },
    });
  }
}
