import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent, LoaderService, ButtonComponent, ThemeService } from 'multi-ui-kit';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ButtonComponent],
  template: `
    <!-- Theme Toggle Button -->
    <div class="fixed top-4 right-4 z-50">
      <button
        (click)="toggleTheme()"
        class="px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
        style="background: var(--muk-primary-user); color: white"
      >
        {{ isDark() ? '☀️ Light Mode' : '🌙 Dark Mode' }}
      </button>
    </div>

    <!-- Theme Display -->
    <div
      class="fixed top-4 left-4 z-50 px-3 py-1 rounded-lg text-sm"
      style="background: var(--muk-bg-elevated); color: var(--muk-text-muted); border: 1px solid var(--muk-border)"
    >
      Theme: {{ theme.resolvedTheme() }} | Preference: {{ theme.preference() }}
    </div>

    <!-- Main Content - Using Theme CSS Variables -->
    <div class="h-screen flex items-center justify-center" style="background: var(--muk-bg)">
      <div class="text-center">
        <muk-loader [autoBind]="true" type="bars" size="xl" color="danger"></muk-loader>

        <div class="mt-8">
          <muk-button
            (clicked)="loadData()"
            variant="danger"
            buttonStyle="solid"
            [hoverLift]="true"
            [shadow]="true"
            [block]="false"
            [gradient]="false"
            size="xl"
            shape="pill"
          >
            <i slot="icon-left" class="bi bi-cloud-upload"></i>
            Save to Cloud
          </muk-button>
        </div>

        <!-- Theme Test Box -->
        <div
          class="mt-8 p-4 rounded-lg"
          style="background: var(--muk-bg-elevated); border: 1px solid var(--muk-border)"
        >
          <p style="color: var(--muk-text)">✅ Theme is working!</p>
          <p style="color: var(--muk-text-muted)" class="text-sm">
            Background: var(--muk-bg)<br />
            Text: var(--muk-text)<br />
            Border: var(--muk-border)
          </p>
        </div>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div
      *ngIf="isloading"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg"
      style="background: var(--muk-bg-elevated); color: var(--muk-text); border: 1px solid var(--muk-border)"
    >
      <div class="flex items-center gap-2">
        <div
          class="animate-spin rounded-full h-4 w-4 border-2"
          style="border-color: var(--muk-primary-user) border-t-transparent"
        ></div>
        Loading... Please wait
      </div>
    </div>
  `,
  styles: [
    `
      /* Smooth transitions for all elements */
      * {
        transition:
          background-color 0.3s ease,
          color 0.3s ease,
          border-color 0.3s ease,
          box-shadow 0.3s ease;
      }
    `,
  ],
})
export class AppComponent {
  isloading = false;
  private loader = inject(LoaderService);
  theme = inject(ThemeService);
  isDark = this.theme.isDark;

  constructor() {
    // Monitor theme changes
    console.log('Initial theme:', this.theme.resolvedTheme());
  }

  toggleTheme() {
    this.theme.toggle();
    console.log('Theme changed to:', this.theme.resolvedTheme());
  }

  async loadData() {
    this.isloading = true;
    this.loader.show('දත්ත ලබාගනිමින් පවතී...');

    setTimeout(() => {
      this.loader.hide();
      this.isloading = false;
      console.log('Data loaded successfully!');
    }, 3000);
  }
}
