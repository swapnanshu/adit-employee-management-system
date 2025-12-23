import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header
      class="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50"
    >
      <nav class="container mx-auto px-4" aria-label="Main Navigation">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a
            routerLink="/"
            class="flex items-center space-x-2 text-slate-900 hover:text-primary-600 transition-colors z-50"
            aria-label="Office Management Home"
            (click)="isMenuOpen = false"
          >
            <div
              class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"
              aria-hidden="true"
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
            <span class="text-xl font-bold">Office RMS</span>
          </a>

          <!-- Desktop Navigation Links -->
          <div class="hidden md:flex space-x-1" role="menubar">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-primary-50 text-primary-700"
              [routerLinkActiveOptions]="{ exact: true }"
              aria-current-when-active="page"
              class="nav-link"
              role="menuitem"
            >
              Dashboard
            </a>
            <a
              routerLink="/companies"
              routerLinkActive="bg-primary-50 text-primary-700"
              aria-current-when-active="page"
              class="nav-link"
              role="menuitem"
            >
              Companies
            </a>
            <a
              routerLink="/employees"
              routerLinkActive="bg-primary-50 text-primary-700"
              aria-current-when-active="page"
              class="nav-link"
              role="menuitem"
            >
              Employees
            </a>
          </div>

          <!-- Desktop User Section -->
          <div
            class="hidden md:flex items-center space-x-3"
            aria-label="User Profile"
          >
            <div class="text-right">
              <p class="text-sm font-medium text-slate-900">Admin User</p>
              <p class="text-xs text-slate-500">Administrator</p>
            </div>
            <div
              class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium"
              aria-hidden="true"
            >
              A
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            type="button"
            class="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors z-50"
            [attr.aria-expanded]="isMenuOpen"
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            (click)="toggleMenu()"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              *ngIf="!isMenuOpen"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              *ngIf="isMenuOpen"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Overlay -->
        <div
          id="mobile-menu"
          class="md:hidden fixed inset-0 bg-white z-40 pt-20 transition-all duration-300 transform"
          [class.translate-x-0]="isMenuOpen"
          [class.translate-x-full]="!isMenuOpen"
          aria-label="Mobile Navigation"
        >
          <div class="flex flex-col px-4 space-y-4">
            <a
              routerLink="/dashboard"
              routerLinkActive="text-primary-600 font-bold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="mobile-nav-link"
              (click)="isMenuOpen = false"
            >
              Dashboard
            </a>
            <a
              routerLink="/companies"
              routerLinkActive="text-primary-600 font-bold"
              class="mobile-nav-link"
              (click)="isMenuOpen = false"
            >
              Companies
            </a>
            <a
              routerLink="/employees"
              routerLinkActive="text-primary-600 font-bold"
              class="mobile-nav-link"
              (click)="isMenuOpen = false"
            >
              Employees
            </a>

            <div class="pt-6 border-t border-slate-100">
              <div class="flex items-center space-x-3">
                <div
                  class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold"
                >
                  A
                </div>
                <div>
                  <p class="font-medium text-slate-900">Admin User</p>
                  <p class="text-sm text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [
    `
      .nav-link {
        @apply px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary-500;
      }
      .mobile-nav-link {
        @apply text-2xl font-medium text-slate-900 py-3 block border-b border-transparent hover:text-primary-600 transition-colors;
      }
    `,
  ],
})
export class HeaderComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
}
