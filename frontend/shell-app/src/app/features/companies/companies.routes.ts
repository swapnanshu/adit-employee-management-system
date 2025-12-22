import { Routes } from "@angular/router";

export const COMPANY_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./companies-wrapper.component").then(
        (m) => m.CompaniesWrapperComponent
      ),
  },
];
