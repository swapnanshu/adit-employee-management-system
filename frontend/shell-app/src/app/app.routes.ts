import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./features/dashboard/dashboard.component").then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: "companies",
    loadComponent: () =>
      import("./features/companies/companies-wrapper.component").then(
        (m) => m.CompaniesWrapperComponent
      ),
  },
  {
    path: "employees",
    loadComponent: () =>
      import("employeeMfe/Component").then((m) => m.AppComponent),
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];
