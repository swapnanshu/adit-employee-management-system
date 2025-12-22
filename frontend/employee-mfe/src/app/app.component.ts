import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
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
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">
              Employee Management
            </h1>
            <p class="text-slate-600 mt-1">
              Manage your organization's employees
            </p>
          </div>
          <button (click)="showAddEmployee()" class="btn-primary">
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

        <!-- Loading State -->
        @if (loading) {
        <div class="flex justify-center items-center py-12">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
          ></div>
        </div>
        }

        <!-- Error State -->
        @if (error && !loading) {
        <div class="card bg-red-50 border-red-200">
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
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-slate-900">
            No employees yet
          </h3>
          <p class="mt-1 text-sm text-slate-500">
            Get started by adding a new employee.
          </p>
        </div>
        } @else {
        <div class="card overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                >
                  Company
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
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
                    class="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    Edit
                  </button>
                  @if (deleteConfirmId === employee.id) {
                  <button
                    (click)="confirmDelete(employee.id)"
                    class="text-red-600 hover:text-red-900 mr-2"
                  >
                    Confirm
                  </button>
                  <button
                    (click)="cancelDelete()"
                    class="text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  } @else {
                  <button
                    (click)="deleteEmployee(employee.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                  }
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

  constructor(
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private roleService: RoleService
  ) {}

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
      this.employeeService.getAll().toPromise(),
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
