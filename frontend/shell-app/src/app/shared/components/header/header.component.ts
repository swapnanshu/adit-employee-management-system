import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="bg-white shadow-sm border-b border-slate-200">
      <nav class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-  primary-600 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
            <span class="text-xl font-bold text-slate-900"
              >Office Management</span
            >
          </div>

          <!-- Navigation Links -->
          <div class="flex space-x-1">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-primary-50 text-primary-700"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium"
            >
              Dashboard
            </a>
            <a
              routerLink="/companies"
              routerLinkActive="bg-primary-50 text-primary-700"
              class="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium"
            >
              Companies
            </a>
            <a
              routerLink="/employees"
              routerLinkActive="bg-primary-50 text-primary-700"
              class="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium"
            >
              Employees
            </a>
          </div>

          <!-- User Section -->
          <div class="flex items-center space-x-3">
            <div class="text-right">
              <p class="text-sm font-medium text-slate-900">Admin User</p>
              <p class="text-xs text-slate-500">Administrator</p>
            </div>
            <div
              class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium"
            >
              A
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {}
