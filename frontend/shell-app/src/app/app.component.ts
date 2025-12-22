import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header></app-header>

      <main class="flex-1 bg-slate-50">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-white border-t border-slate-200 py-4">
        <div class="container mx-auto px-4 text-center text-sm text-slate-600">
          © 2024 Office Management System. Built with Angular & Microservices.
        </div>
      </footer>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = "Office Management System";
}
