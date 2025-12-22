import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  Employee,
  Company,
  Role,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../models/employee.model";

@Component({
  selector: "app-employee-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div
          class="flex items-center justify-between p-6 border-b border-slate-200"
        >
          <h2 class="text-xl font-bold text-slate-900">
            {{ employee ? "Edit Employee" : "Add New Employee" }}
          </h2>
          <button
            (click)="onCancel()"
            class="text-slate-400 hover:text-slate-600"
            type="button"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          [formGroup]="employeeForm"
          (ngSubmit)="onSubmit()"
          class="p-6 space-y-4"
        >
          <!-- First Name -->
          <div>
            <label for="first_name" class="label">
              First Name <span class="text-red-500">*</span>
            </label>
            <input
              id="first_name"
              type="text"
              formControlName="first_name"
              class="input"
              [class.border-red-500]="
                employeeForm.get('first_name')?.invalid &&
                employeeForm.get('first_name')?.touched
              "
              placeholder="e.g., John"
            />
            @if (employeeForm.get('first_name')?.invalid &&
            employeeForm.get('first_name')?.touched) {
            <p class="mt-1 text-sm text-red-600">
              @if (employeeForm.get('first_name')?.errors?.['required']) { First
              name is required } @if
              (employeeForm.get('first_name')?.errors?.['minlength']) { First
              name must be at least 2 characters }
            </p>
            }
          </div>

          <!-- Last Name -->
          <div>
            <label for="last_name" class="label">
              Last Name <span class="text-red-500">*</span>
            </label>
            <input
              id="last_name"
              type="text"
              formControlName="last_name"
              class="input"
              [class.border-red-500]="
                employeeForm.get('last_name')?.invalid &&
                employeeForm.get('last_name')?.touched
              "
              placeholder="e.g., Doe"
            />
            @if (employeeForm.get('last_name')?.invalid &&
            employeeForm.get('last_name')?.touched) {
            <p class="mt-1 text-sm text-red-600">
              @if (employeeForm.get('last_name')?.errors?.['required']) { Last
              name is required } @if
              (employeeForm.get('last_name')?.errors?.['minlength']) { Last name
              must be at least 2 characters }
            </p>
            }
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="label">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="input"
              [class.border-red-500]="
                employeeForm.get('email')?.invalid &&
                employeeForm.get('email')?.touched
              "
              placeholder="john.doe@example.com"
            />
            @if (employeeForm.get('email')?.invalid &&
            employeeForm.get('email')?.touched) {
            <p class="mt-1 text-sm text-red-600">
              @if (employeeForm.get('email')?.errors?.['required']) { Email is
              required } @if (employeeForm.get('email')?.errors?.['email']) {
              Please enter a valid email }
            </p>
            }
          </div>

          <!-- Company Dropdown -->
          <div>
            <label for="company_id" class="label">
              Company <span class="text-red-500">*</span>
            </label>
            <select
              id="company_id"
              formControlName="company_id"
              class="input"
              [class.border-red-500]="
                employeeForm.get('company_id')?.invalid &&
                employeeForm.get('company_id')?.touched
              "
            >
              <option value="">Select a company</option>
              @for (company of companies; track company.id) {
              <option [value]="company.id">{{ company.name }}</option>
              }
            </select>
            @if (employeeForm.get('company_id')?.invalid &&
            employeeForm.get('company_id')?.touched) {
            <p class="mt-1 text-sm text-red-600">Company is required</p>
            }
          </div>

          <!-- Role Dropdown -->
          <div>
            <label for="role_id" class="label">
              Role <span class="text-red-500">*</span>
            </label>
            <select
              id="role_id"
              formControlName="role_id"
              class="input"
              [class.border-red-500]="
                employeeForm.get('role_id')?.invalid &&
                employeeForm.get('role_id')?.touched
              "
            >
              <option value="">Select a role</option>
              @for (role of roles; track role.id) {
              <option [value]="role.id">{{ role.title }}</option>
              }
            </select>
            @if (employeeForm.get('role_id')?.invalid &&
            employeeForm.get('role_id')?.touched) {
            <p class="mt-1 text-sm text-red-600">Role is required</p>
            }
          </div>

          <!-- Submit Error -->
          @if (submitError) {
          <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ submitError }}</p>
          </div>
          }

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              (click)="onCancel()"
              class="btn-secondary"
              [disabled]="loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn-primary"
              [disabled]="loading || employeeForm.invalid"
            >
              @if (loading) {
              <span class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ employee ? "Updating..." : "Creating..." }}
              </span>
              } @else {
              {{ employee ? "Update Employee" : "Create Employee" }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: Employee | null = null;
  @Input() companies: Company[] = [];
  @Input() roles: Role[] = [];
  @Output() success = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  employeeForm!: FormGroup;
  loading = false;
  submitError: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      first_name: [
        this.employee?.first_name || "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      last_name: [
        this.employee?.last_name || "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: [
        this.employee?.email || "",
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      company_id: [this.employee?.company_id || "", [Validators.required]],
      role_id: [this.employee?.role_id || "", [Validators.required]],
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      Object.keys(this.employeeForm.controls).forEach((key) => {
        this.employeeForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.submitError = null;

    // Emit success with form data
    // Parent component will handle the actual API call
    this.success.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  getFormData(): CreateEmployeeDto | UpdateEmployeeDto {
    return this.employeeForm.value;
  }
}
