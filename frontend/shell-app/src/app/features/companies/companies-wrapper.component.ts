import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { loadRemoteModule } from "@angular-architects/module-federation-runtime";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-companies-wrapper",
  standalone: true,
  template: "<div #root></div>",
})
export class CompaniesWrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild("root", { static: true }) root!: ElementRef;
  private unmount?: () => void;

  async ngAfterViewInit() {
    try {
      const m = await loadRemoteModule({
        type: "module",
        remoteEntry: environment.companyMfeUrl,
        exposedModule: "./Component",
      });

      this.unmount = m.mount(this.root.nativeElement);
    } catch (err) {
      console.error("Error loading Company MFE:", err);
    }
  }

  ngOnDestroy() {
    this.unmount?.();
  }
}
