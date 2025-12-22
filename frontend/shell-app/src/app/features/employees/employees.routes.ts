import { Routes } from "@angular/router";

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./employees-wrapper.component").then(
        (m) => m.EmployeesWrapperComponent
      ),
  },
];
