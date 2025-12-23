import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { forkJoin, Subscription } from "rxjs";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" role="list">
        @for (stat of stats; track stat.title) {
        <a
          [routerLink]="stat.route"
          class="card hover:shadow-md transition-shadow cursor-pointer block focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          role="listitem"
          [attr.aria-label]="stat.title + ': ' + stat.value"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">{{ stat.title }}</p>
              <div class="flex items-center mt-2" aria-live="polite">
                @if (loading) {
                <div
                  class="h-8 w-16 bg-slate-200 animate-pulse rounded"
                  aria-label="Loading stats"
                ></div>
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
              aria-hidden="true"
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
        </a>
        }
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Industry Chart -->
        <div class="card overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-900">
              Companies by Industry
            </h2>
            <p class="text-sm text-slate-500">
              Distribution of organizations across sectors
            </p>
          </div>
          <div class="p-6 relative" style="height: 350px;">
            @if (loadingCharts) {
            <div
              class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10"
            >
              <div
                class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"
              ></div>
            </div>
            }
            <canvas #industryChartCanvas></canvas>
          </div>
        </div>

        <!-- Role Chart -->
        <div class="card overflow-hidden">
          <div class="p-6 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-900">Employees by Role</h2>
            <p class="text-sm text-slate-500">
              Breakdown of human resources by job title
            </p>
          </div>
          <div class="p-6 relative" style="height: 350px;">
            @if (loadingCharts) {
            <div
              class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10"
            >
              <div
                class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"
              ></div>
            </div>
            }
            <canvas #roleChartCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <section class="card" aria-labelledby="quick-actions-title">
        <h2
          id="quick-actions-title"
          class="text-xl font-bold text-slate-900 mb-4"
        >
          Quick Actions
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a routerLink="/employees" class="action-card">
            <div class="flex items-center space-x-3">
              <div class="icon-box bg-primary-100 text-primary-600">
                <svg
                  class="w-5 h-5"
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
          </a>

          <a routerLink="/companies" class="action-card">
            <div class="flex items-center space-x-3">
              <div class="icon-box bg-primary-100 text-primary-600">
                <svg
                  class="w-5 h-5"
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
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .action-card {
        @apply text-left p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all block focus:outline-none focus:ring-2 focus:ring-primary-500;
      }
      .icon-box {
        @apply w-10 h-10 rounded-lg flex items-center justify-center;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("industryChartCanvas")
  industryChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("roleChartCanvas") roleChartCanvas!: ElementRef<HTMLCanvasElement>;

  loading = true;
  loadingCharts = true;
  private industryChart?: Chart;
  private roleChart?: Chart;
  private statsSubscription?: Subscription;

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

  private readonly chartColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#64748b",
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
    // Charts will be initialized once data is loaded
  }

  ngOnDestroy() {
    this.statsSubscription?.unsubscribe();
    this.industryChart?.destroy();
    this.roleChart?.destroy();
  }

  loadStats() {
    this.loading = true;
    this.loadingCharts = true;

    // Fetch all stats in parallel
    this.statsSubscription = forkJoin({
      companies: this.http.get<ApiResponse>(
        `http://localhost:3001/api/v1/companies?limit=1`
      ),
      employees: this.http.get<ApiResponse>(
        `http://localhost:3002/api/v1/employees?limit=1`
      ),
      roles: this.http.get<ApiResponse>(
        `http://localhost:3003/api/v1/roles?limit=1`
      ),
      industryStats: this.http.get<any>(
        `http://localhost:3001/api/v1/companies/stats/industry`
      ),
      roleStats: this.http.get<any>(
        `http://localhost:3002/api/v1/employees/stats/roles`
      ),
    }).subscribe({
      next: (results) => {
        // Update KPI Stats
        this.stats[0].value = (
          results.companies.pagination?.total || 0
        ).toString();
        this.stats[1].value = (
          results.employees.pagination?.total || 0
        ).toString();
        this.stats[2].value = (results.roles.pagination?.total || 0).toString();
        this.loading = false;

        // Initialize Charts
        this.initIndustryChart(results.industryStats.data || []);
        this.initRoleChart(results.roleStats.data || []);
        this.loadingCharts = false;
      },
      error: (err) => {
        console.error("Error loading dashboard stats:", err);
        this.loading = false;
        this.loadingCharts = false;
      },
    });
  }

  private initIndustryChart(data: any[]) {
    if (!this.industryChartCanvas) return;

    const ctx = this.industryChartCanvas.nativeElement.getContext("2d");
    if (!ctx) return;

    this.industryChart?.destroy();

    const labels = data.map((item) => item.industry);
    const counts = data.map((item) => item.count);

    this.industryChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: this.chartColors,
            borderWidth: 1,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { size: 12 },
            },
          },
          tooltip: {
            padding: 12,
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 13 },
            displayColors: true,
          },
        },
      },
    });
  }

  private initRoleChart(data: any[]) {
    if (!this.roleChartCanvas) return;

    const ctx = this.roleChartCanvas.nativeElement.getContext("2d");
    if (!ctx) return;

    this.roleChart?.destroy();

    const labels = data.map((item) => item.role);
    const counts = data.map((item) => item.count);

    this.roleChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: this.chartColors.slice().reverse(),
            borderWidth: 1,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { size: 12 },
            },
          },
          tooltip: {
            padding: 12,
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 13 },
            displayColors: true,
          },
        },
      },
    });
  }
}
