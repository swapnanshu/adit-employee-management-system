import { Routes } from "@angular/router";
import { environment } from "../environments/environment";

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
      import("@angular-architects/module-federation-runtime")
        .then((r) =>
          r.loadRemoteModule({
            type: "module",
            remoteEntry: environment.employeeMfeUrl,
            exposedModule: "./Component",
          })
        )
        .then((m) => m.AppComponent),
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];
