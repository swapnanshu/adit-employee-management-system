import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { EmployeeService } from "./services/employee.service";
import { CompanyService } from "./services/company.service";
import { RoleService } from "./services/role.service";
import { Employee, Company, Role } from "./models/employee.model";
import { EmployeeFormComponent } from "./components/employee-form.component";

interface EmployeeWithDetails extends Employee {
  companyName?: string;
  roleTitle?: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, EmployeeFormComponent],
  template: `
    <div class="min-h-screen bg-slate-50">
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-8"
        >
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">
              Employee Management
            </h1>
            <p class="text-slate-600 mt-1">
              Manage your organization's employees
            </p>
          </div>
          <button
            (click)="showAddEmployee()"
            class="btn-primary w-full md:w-fit px-8"
          >
            <svg
              class="w-5 h-5 inline-block mr-2 -mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Employee
          </button>
        </div>

        <!-- Search and Filters -->
        <div class="mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <!-- Search -->
          <div class="relative w-full md:max-w-sm">
            <input
              type="text"
              placeholder="Search employees..."
              (input)="onSearch($event)"
              class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
              [value]="searchTerm"
            />
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Company Filter -->
          <div class="w-full md:w-56">
            <select
              (change)="onFilterChange('company', $event)"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm bg-white"
              [value]="filterCompanyId"
            >
              <option value="">All Companies</option>
              @for (company of companies; track company.id) {
              <option [value]="company.id">{{ company.name }}</option>
              }
            </select>
          </div>

          <!-- Role Filter -->
          <div class="w-full md:w-56">
            <select
              (change)="onFilterChange('role', $event)"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm bg-white"
              [value]="filterRoleId"
            >
              <option value="">All Roles</option>
              @for (role of roles; track role.id) {
              <option [value]="role.id">{{ role.title }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Loading State -->
        @if (loading) {
        <div
          class="flex justify-center items-center py-12"
          role="status"
          aria-label="Loading employees"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
            aria-hidden="true"
          ></div>
          <span class="sr-only">Loading...</span>
        </div>
        }

        <!-- Error State -->
        @if (error && !loading) {
        <div class="card bg-red-50 border-red-200" role="alert">
          <p class="text-red-600">{{ error }}</p>
          <button (click)="loadEmployees()" class="btn-primary mt-4">
            Retry
          </button>
        </div>
        }

        <!-- Employee List -->
        @if (!loading && !error) { @if (employees.length === 0) {
        <div class="card text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-slate-900">
            {{
              searchTerm || filterCompanyId || filterRoleId
                ? "No employees found"
                : "No employees yet"
            }}
          </h3>
          <p class="mt-1 text-sm text-slate-500">
            {{
              searchTerm || filterCompanyId || filterRoleId
                ? "Try adjusting your filters."
                : "Get started by adding a new employee."
            }}
          </p>
        </div>
        } @else {
        <div class="card overflow-x-auto p-0">
          <table class="min-w-full" aria-label="Employees List">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  scope="col"
                  (click)="onSort('first_name')"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Name
                  <span
                    class="ml-1"
                    [class.text-primary-600]="sortConfig.key === 'first_name'"
                  >
                    {{ getSortIcon("first_name") }}
                  </span>
                </th>
                <th
                  scope="col"
                  (click)="onSort('email')"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  Email
                  <span
                    class="ml-1"
                    [class.text-primary-600]="sortConfig.key === 'email'"
                  >
                    {{ getSortIcon("email") }}
                  </span>
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              @for (employee of employees; track employee.id) {
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-slate-900">
                    {{ employee.first_name }} {{ employee.last_name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-slate-600">{{ employee.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-slate-600">
                    {{ employee.companyName || "Unknown" }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-slate-600">
                    {{ employee.roleTitle || "Unknown" }}
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <button
                    (click)="editEmployee(employee)"
                    class="text-primary-600 hover:text-primary-900 mr-4 focus:outline-none focus:underline"
                    [attr.aria-label]="
                      'Edit ' + employee.first_name + ' ' + employee.last_name
                    "
                  >
                    Edit
                  </button>
                  <button
                    (click)="deleteEmployee(employee.id)"
                    class="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                    [attr.aria-label]="
                      'Delete ' + employee.first_name + ' ' + employee.last_name
                    "
                  >
                    Delete
                  </button>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
        } }

        <!-- Employee Form Modal -->
        @if (showForm) {
        <app-employee-form
          [employee]="selectedEmployee"
          [companies]="companies"
          [roles]="roles"
          (success)="handleFormSuccess()"
          (cancel)="handleFormCancel()"
        ></app-employee-form>
        }

        <!-- Delete Confirmation Modal -->
        @if (deleteConfirmId) {
        <div
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
          role="dialog"
          aria-modal="true"
          (keydown.escape)="cancelDelete()"
          tabindex="-1"
          #deleteModal
        >
          <div class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-2">
              Confirm Deletion
            </h3>
            <p class="text-slate-600 mb-6">
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </p>
            <div class="flex justify-end space-x-3">
              <button (click)="cancelDelete()" class="btn-secondary">
                Cancel
              </button>
              <button
                (click)="confirmDelete(deleteConfirmId)"
                class="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  @ViewChild(EmployeeFormComponent) formComponent?: EmployeeFormComponent;

  employees: EmployeeWithDetails[] = [];
  companies: Company[] = [];
  roles: Role[] = [];
  loading = true;
  error: string | null = null;
  deleteConfirmId: string | null = null;
  showForm = false;
  selectedEmployee: Employee | null = null;

  // Search & Filter State
  searchTerm = "";
  filterCompanyId = "";
  filterRoleId = "";
  sortConfig: { key: string; direction: "ASC" | "DESC" } = {
    key: "created_at",
    direction: "DESC",
  };

  private searchSubject = new Subject<string>();

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private roleService: RoleService
  ) {
    this.searchSubject.pipe(debounceTime(300)).subscribe((term) => {
      this.searchTerm = term;
      this.loadEmployees();
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.error = null;

    Promise.all([
      this.employeeService
        .getAll({
          search: this.searchTerm,
          company_id: this.filterCompanyId,
          role_id: this.filterRoleId,
          sortBy: this.sortConfig.key,
          sortOrder: this.sortConfig.direction,
        })
        .toPromise(),
      this.companyService.getAll().toPromise(),
      this.roleService.getAll().toPromise(),
    ])
      .then(([employees, companies, roles]) => {
        this.companies = companies || [];
        this.roles = roles || [];

        this.employees = (employees || []).map((emp) => ({
          ...emp,
          companyName: this.companies.find((c) => c.id === emp.company_id)
            ?.name,
          roleTitle: this.roles.find((r) => r.id === emp.role_id)?.title,
        }));

        this.loading = false;
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        this.error = "Failed to load employees. Please try again.";
        this.loading = false;
      });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onFilterChange(type: "company" | "role", event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (type === "company") this.filterCompanyId = value;
    else if (type === "role") this.filterRoleId = value;
    this.loadEmployees();
  }

  onSort(key: string) {
    if (this.sortConfig.key === key) {
      this.sortConfig.direction =
        this.sortConfig.direction === "ASC" ? "DESC" : "ASC";
    } else {
      this.sortConfig.key = key;
      this.sortConfig.direction = "ASC";
    }
    this.loadEmployees();
  }

  getSortIcon(key: string): string {
    if (this.sortConfig.key !== key) return "↕";
    return this.sortConfig.direction === "ASC" ? "↑" : "↓";
  }

  showAddEmployee() {
    this.selectedEmployee = null;
    this.showForm = true;
  }

  editEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.showForm = true;
  }

  handleFormSuccess() {
    const formData = this.formComponent?.getFormData();
    if (!formData) return;

    if (this.selectedEmployee) {
      this.employeeService
        .update(this.selectedEmployee.id, formData)
        .subscribe({
          next: () => {
            this.showForm = false;
            this.selectedEmployee = null;
            this.loadEmployees();
          },
          error: (err) => {
            console.error("Error updating employee:", err);
            alert(err.error?.error || "Failed to update employee");
          },
        });
    } else {
      this.employeeService
        .create(formData as import("./models/employee.model").CreateEmployeeDto)
        .subscribe({
          next: () => {
            this.showForm = false;
            this.loadEmployees();
          },
          error: (err) => {
            console.error("Error creating employee:", err);
            alert(err.error?.error || "Failed to create employee");
          },
        });
    }
  }

  handleFormCancel() {
    this.showForm = false;
    this.selectedEmployee = null;
  }

  deleteEmployee(id: string) {
    this.deleteConfirmId = id;
  }

  confirmDelete(id: string) {
    this.employeeService.delete(id).subscribe({
      next: () => {
        this.employees = this.employees.filter((e) => e.id !== id);
        this.deleteConfirmId = null;
      },
      error: (err) => {
        console.error("Error deleting employee:", err);
        alert("Failed to delete employee. Please try again.");
        this.deleteConfirmId = null;
      },
    });
  }

  cancelDelete() {
    this.deleteConfirmId = null;
  }
}
