import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    ThemeService,
    ButtonComponent,
    InputComponent,
    LoaderComponent,
    AlertComponent,
    ToastService,
    ToastContainerComponent,
    MukToastPosition,
    MukToastAnimation,
} from 'multi-ui-kit';

type AlertKey = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonComponent,
        InputComponent,
        LoaderComponent,
        AlertComponent,
        ToastContainerComponent,
    ],
    template: `
    <div class="page">
      <!-- HEADER + THEME CONTROLS -->
      <header class="header">
        <div>
          <h1>MUK UI Kit · Theme Test</h1>
          <p class="muted">
            Mode: <strong>{{ theme.mode() }}</strong> ·
            Showing: <strong>{{ theme.resolved() }}</strong>
          </p>
        </div>

        <div class="theme-controls">
          <muk-button variant="info" buttonStyle="ghost" size="sm" (clicked)="theme.toggle()">
            {{ theme.isDark() ? '☀️ Light' : '🌙 Dark' }}
          </muk-button>
          <div class="seg">
            <muk-button size="sm" [buttonStyle]="theme.mode() === 'light' ? 'solid' : 'ghost'" variant="primary" (clicked)="theme.setMode('light')">Light</muk-button>
            <muk-button size="sm" [buttonStyle]="theme.mode() === 'dark' ? 'solid' : 'ghost'" variant="primary" (clicked)="theme.setMode('dark')">Dark</muk-button>
            <muk-button size="sm" [buttonStyle]="theme.mode() === 'auto' ? 'solid' : 'ghost'" variant="primary" (clicked)="theme.setMode('auto')">Auto</muk-button>
          </div>
        </div>
      </header>


      <!-- TOASTS - POSITIONS & ANIMATIONS -->
      <section class="card">
        <h2>Toasts · Positions (click to show)</h2>
        <p class="muted">Each button shows a toast at that screen position.</p>
        <div class="pos-grid">
          <muk-button size="sm" variant="info" buttonStyle="soft" (clicked)="toastAt('top-left')">↖ Top Left</muk-button>
          <muk-button size="sm" variant="info" buttonStyle="soft" (clicked)="toastAt('top-center')">↑ Top Center</muk-button>
          <muk-button size="sm" variant="info" buttonStyle="soft" (clicked)="toastAt('top-right')">↗ Top Right</muk-button>
          <muk-button size="sm" variant="info" buttonStyle="soft" (clicked)="toastAt('bottom-left')">↙ Bottom Left</muk-button>
          <muk-button size="sm" variant="info" buttonStyle="soft" (clicked)="toastAt('bottom-center')">↓ Bottom Center</muk-button>
          <muk-button size="sm" variant="info" buttonStyle="soft" (clicked)="toastAt('bottom-right')">↘ Bottom Right</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Toasts · Animations</h2>
        <p class="muted">Each button shows a toast with that entrance animation.</p>
        <div class="row">
          <muk-button size="sm" variant="primary" (clicked)="toastAnim('from-left', 'top-left')">From Left →</muk-button>
          <muk-button size="sm" variant="primary" (clicked)="toastAnim('from-right', 'top-right')">← From Right</muk-button>
          <muk-button size="sm" variant="primary" (clicked)="toastAnim('from-top', 'top-center')">↓ From Top</muk-button>
          <muk-button size="sm" variant="primary" (clicked)="toastAnim('from-bottom', 'bottom-center')">↑ From Bottom</muk-button>
          <muk-button size="sm" variant="primary" (clicked)="toastAnim('fade', 'top-center')">○ Fade</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Toasts · Variants</h2>
        <p class="muted">Different colors. Default position top-right, 4s auto-dismiss with progress.</p>
        <div class="row">
          <muk-button size="sm" variant="success" (clicked)="toast.success('Saved successfully!', { title: 'Success' })">Success</muk-button>
          <muk-button size="sm" variant="danger" (clicked)="toast.error('Something went wrong', { title: 'Error' })">Error</muk-button>
          <muk-button size="sm" variant="warning" (clicked)="toast.warning('Please review this', { title: 'Warning' })">Warning</muk-button>
          <muk-button size="sm" variant="info" (clicked)="toast.info('New update available')">Info</muk-button>
          <span class="gap"></span>
          <muk-button size="sm" variant="secondary" buttonStyle="ghost" (clicked)="toast.clear()">Clear All</muk-button>
        </div>
      </section>


      <!-- ALERTS - CLICK TO SHOW -->
      <section class="card">
        <h2>Alerts · Click to Show</h2>
        <p class="muted">Click a button to toggle each alert on/off. Click X to dismiss.</p>
        <div class="row">
          <muk-button variant="success" size="sm" (clicked)="toggle('success')">Success</muk-button>
          <muk-button variant="warning" size="sm" (clicked)="toggle('warning')">Warning</muk-button>
          <muk-button variant="danger" size="sm" (clicked)="toggle('danger')">Danger</muk-button>
          <muk-button variant="info" size="sm" (clicked)="toggle('info')">Info</muk-button>
          <muk-button variant="primary" size="sm" (clicked)="toggle('primary')">Primary</muk-button>
          <muk-button variant="secondary" size="sm" (clicked)="toggle('secondary')">Secondary</muk-button>
        </div>
        <div class="alert-stack">
          @if (show().success) {
            <muk-alert variant="success" title="Success" [dismissible]="true" (dismissed)="hide('success')">
              Your changes have been saved successfully!
            </muk-alert>
          }
          @if (show().warning) {
            <muk-alert variant="warning" title="Warning" [dismissible]="true" (dismissed)="hide('warning')">
              Your subscription expires in 3 days.
            </muk-alert>
          }
          @if (show().danger) {
            <muk-alert variant="danger" title="Error" [dismissible]="true" (dismissed)="hide('danger')">
              Failed to connect to the server. Please try again.
            </muk-alert>
          }
          @if (show().info) {
            <muk-alert variant="info" title="Information" [dismissible]="true" (dismissed)="hide('info')">
              A new version of the app is available.
            </muk-alert>
          }
          @if (show().primary) {
            <muk-alert variant="primary" title="Notice" [dismissible]="true" (dismissed)="hide('primary')">
              This is a primary notification.
            </muk-alert>
          }
          @if (show().secondary) {
            <muk-alert variant="secondary" title="Note" [dismissible]="true" (dismissed)="hide('secondary')">
              This is a secondary message.
            </muk-alert>
          }
        </div>
      </section>

      <!-- ALERTS - AUTO DISMISS TOAST -->
      <section class="card">
        <h2>Alerts · Auto-Dismiss (Toast)</h2>
        <p class="muted">Auto-dismisses in 4 seconds with a progress bar.</p>
        <div class="row">
          <muk-button variant="success" size="sm" (clicked)="showToast()">Show Toast</muk-button>
        </div>
        <div class="alert-stack">
          @if (toastVisible()) {
            <muk-alert variant="success" [autoDismiss]="4000" [showProgress]="true" [dismissible]="true" (dismissed)="toastVisible.set(false)">
              Copied to clipboard! This disappears in 4 seconds.
            </muk-alert>
          }
        </div>
      </section>

      <!-- ALERTS - ALL STYLES -->
      <section class="card">
        <h2>Alerts · All Styles</h2>
        <div class="alert-stack">
          <muk-alert variant="success" alertStyle="soft" title="Soft">Soft style — tinted background (default).</muk-alert>
          <muk-alert variant="success" alertStyle="solid" title="Solid">Solid style — filled background.</muk-alert>
          <muk-alert variant="success" alertStyle="outline" title="Outline">Outline style — transparent with border.</muk-alert>
          <muk-alert variant="success" alertStyle="left-accent" title="Left Accent">Left-accent style — colored bar on the left.</muk-alert>
        </div>
      </section>

      <!-- ALERTS - ALL VARIANTS -->
      <section class="card">
        <h2>Alerts · All Variants</h2>
        <div class="alert-stack">
          <muk-alert variant="primary">Primary alert message.</muk-alert>
          <muk-alert variant="secondary">Secondary alert message.</muk-alert>
          <muk-alert variant="success">Success alert message.</muk-alert>
          <muk-alert variant="warning">Warning alert message.</muk-alert>
          <muk-alert variant="danger">Danger alert message.</muk-alert>
          <muk-alert variant="info">Info alert message.</muk-alert>
        </div>
      </section>

      <!-- ALERTS - SIZES & FEATURES -->
      <section class="card">
        <h2>Alerts · Sizes & Features</h2>
        <div class="alert-stack">
          <muk-alert variant="info" size="sm">Small alert</muk-alert>
          <muk-alert variant="info" size="md">Medium alert (default)</muk-alert>
          <muk-alert variant="info" size="lg">Large alert</muk-alert>
          <muk-alert variant="info" [showIcon]="false">No icon — just text.</muk-alert>
          <muk-alert variant="warning" title="Unsaved changes">
            You have unsaved changes. Save before leaving?
            <div slot="actions">
              <muk-button size="sm" variant="warning">Save</muk-button>
              <muk-button size="sm" variant="secondary" buttonStyle="ghost">Discard</muk-button>
            </div>
          </muk-alert>
        </div>
      </section>


      <!-- BUTTONS -->
      <section class="card">
        <h2>Buttons · Solid</h2>
        <div class="row">
          <muk-button variant="primary">Primary</muk-button>
          <muk-button variant="secondary">Secondary</muk-button>
          <muk-button variant="success">Success</muk-button>
          <muk-button variant="warning">Warning</muk-button>
          <muk-button variant="danger">Danger</muk-button>
          <muk-button variant="info">Info</muk-button>
          <muk-button variant="light">Light</muk-button>
          <muk-button variant="dark">Dark</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Buttons · States</h2>
        <div class="row">
          <muk-button variant="primary">
            <i slot="icon-left" class="bi bi-search"></i>
            With Icon
          </muk-button>
          <muk-button variant="primary" [disabled]="true">Disabled</muk-button>
          <muk-button variant="primary" [loading]="loadingBtn()" (clicked)="simulateLoading()">
            {{ loadingBtn() ? 'Loading...' : 'Click for loading' }}
          </muk-button>
        </div>
      </section>


      <!-- INPUTS -->
      <section class="card">
        <h2>Inputs · Floating Label</h2>
        <div class="grid">
          <muk-input label="Full Name" [(ngModel)]="name"></muk-input>
          <muk-input label="Search" type="search" [(ngModel)]="searchVal">
            <i slot="icon-left" class="bi bi-person-check-fill"></i>
          </muk-input>
          <muk-input label="Email Address" type="email" placeholder="you@example.com" [formControl]="emailCtrl" ></muk-input>
          <muk-input label="Password" type="password" placeholder="At least 8 characters" [formControl]="passwordCtrl" ></muk-input>
        </div>
      </section>


      <!-- LOADERS -->
      <section class="card">
        <h2>Loaders · Types</h2>
        <div class="loader-grid">
          <div class="loader-cell"><muk-loader type="dots" [showMessage]="false"></muk-loader><span class="label">dots</span></div>
          <div class="loader-cell"><muk-loader type="spinner" [showMessage]="false"></muk-loader><span class="label">spinner</span></div>
          <div class="loader-cell"><muk-loader type="pulse" [showMessage]="false"></muk-loader><span class="label">pulse</span></div>
          <div class="loader-cell"><muk-loader type="wave" [showMessage]="false"></muk-loader><span class="label">wave</span></div>
          <div class="loader-cell"><muk-loader type="bars" [showMessage]="false"></muk-loader><span class="label">bars</span></div>
          <div class="loader-cell"><muk-loader type="circle" [showMessage]="false"></muk-loader><span class="label">circle</span></div>
        </div>
      </section>

      <footer class="footer muted">
        <p>All components above auto-adapt to the active theme.</p>
      </footer>
    </div>

    <!-- Toast container - place ONCE at app root -->
    <muk-toast-container></muk-toast-container>
  `,
    styles: [`
    :host { display: block; min-height: 100vh; }
    .page { max-width: 1100px; margin: 0 auto; padding: 32px 24px 64px; }
    .header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 24px; flex-wrap: wrap; margin-bottom: 32px; padding-bottom: 20px;
      border-bottom: 1px solid var(--muk-border);
    }
    .header h1 { font-size: 1.625rem; font-weight: 700; margin: 0 0 6px 0; color: var(--muk-text); }
    .muted { color: var(--muk-text-muted); font-size: 0.875rem; margin: 0 0 12px 0; }
    .theme-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .seg { display: inline-flex; gap: 4px; padding: 4px; background: var(--muk-surface-muted); border-radius: 10px; }
    .card {
      background: var(--muk-surface); border: 1px solid var(--muk-border); border-radius: 14px;
      padding: 22px 24px; margin-bottom: 18px; box-shadow: var(--muk-shadow-sm);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }
    .card h2 {
      font-size: 1rem; font-weight: 600; color: var(--muk-text-muted);
      letter-spacing: 0.02em; text-transform: uppercase; margin: 0 0 16px 0;
    }
    .row { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 10px; }
    .pos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 520px; }
    .gap { display: inline-block; width: 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px 16px; }
    .alert-stack { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
    .alert-stack:empty { margin-top: 0; }
    .loader-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
    .loader-cell {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 8px; padding: 20px 12px; background: var(--muk-surface-sunken);
      border: 1px solid var(--muk-border-subtle); border-radius: 10px; min-height: 110px;
    }
    .loader-cell .label {
      font-size: 0.75rem; color: var(--muk-text-subtle); font-weight: 500;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--muk-border-subtle); }
  `],
})
export class KitPreviewComponent {
    theme = inject(ThemeService);
    toast = inject(ToastService);

    toastAt(position: MukToastPosition) {
        this.toast.show({
            message: `Toast at ${position}`,
            title: 'Position Demo',
            variant: 'info',
            position,
        });
    }

    toastAnim(animation: MukToastAnimation, position: MukToastPosition) {
        this.toast.show({
            message: `Animation: ${animation}`,
            title: 'Animation Demo',
            variant: 'info',
            position,
            animation,
            showProgress: true,
            dismissible: true,
            showIcon: true

        });
    }

    loadingBtn = signal(false);
    submitting = signal(false);

    show = signal<Record<AlertKey, boolean>>({
        success: false, warning: false, danger: false,
        info: false, primary: false, secondary: false,
    });

    toastVisible = signal(false);

    name = '';
    searchVal = '';
    phone = '';

    emailCtrl = new FormControl('', [Validators.required, Validators.email]);
    passwordCtrl = new FormControl('', [Validators.required, Validators.minLength(8)]);

    toggle(key: AlertKey) {
        this.show.update(s => ({ ...s, [key]: !s[key] }));
    }

    hide(key: AlertKey) {
        this.show.update(s => ({ ...s, [key]: false }));
    }

    showToast() {
        this.toastVisible.set(false);
        setTimeout(() => this.toastVisible.set(true), 50);
    }

    simulateLoading() {
        this.loadingBtn.set(true);
        setTimeout(() => this.loadingBtn.set(false), 1800);
    }
}