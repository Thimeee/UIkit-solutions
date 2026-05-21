import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ThemeService,
  ButtonComponent,
  InputComponent,
  LoaderComponent,
} from 'multi-ui-kit';

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
  ],
  template: `
    <div class="page ">
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
          <muk-button
            variant="info"
            buttonStyle="ghost"
            size="sm"
            (clicked)="theme.toggle()"
          >
            {{ theme.isDark() ? '☀️ Light' : '🌙 Dark' }}
          </muk-button>

          <div class="seg">
            <muk-button
              size="sm"
              [buttonStyle]="theme.mode() === 'light' ? 'solid' : 'ghost'"
              variant="primary"
              (clicked)="theme.setMode('light')"
            >Light</muk-button>
            <muk-button
              size="sm"
              [buttonStyle]="theme.mode() === 'dark' ? 'solid' : 'ghost'"
              variant="primary"
              (clicked)="theme.setMode('dark')"
            >Dark</muk-button>
            <muk-button
              size="sm"
              [buttonStyle]="theme.mode() === 'auto' ? 'solid' : 'ghost'"
              variant="primary"
              (clicked)="theme.setMode('auto')"
            >Auto</muk-button>
          </div>
        </div>
      </header>


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
        <h2>Buttons · Soft</h2>
        <div class="row">
          <muk-button variant="primary" buttonStyle="soft">Primary</muk-button>
          <muk-button variant="success" buttonStyle="soft">Success</muk-button>
          <muk-button variant="warning" buttonStyle="soft">Warning</muk-button>
          <muk-button variant="danger" buttonStyle="soft">Danger</muk-button>
          <muk-button variant="info" buttonStyle="soft">Info</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Buttons · Outline & Ghost</h2>
        <div class="row">
          <muk-button variant="primary" buttonStyle="outline">Primary</muk-button>
          <muk-button variant="danger" buttonStyle="outline">Delete</muk-button>
          <muk-button variant="success" buttonStyle="outline">Save</muk-button>
          <span class="gap"></span>
          <muk-button variant="primary" buttonStyle="ghost">Ghost</muk-button>
          <muk-button variant="dark" buttonStyle="ghost">Ghost Dark</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Buttons · Sizes</h2>
        <div class="row" style="align-items: center;">
          <muk-button variant="primary" size="xs">XS</muk-button>
          <muk-button variant="primary" size="sm">Small</muk-button>
          <muk-button variant="primary" size="md">Medium</muk-button>
          <muk-button variant="primary" size="lg">Large</muk-button>
          <muk-button variant="primary" size="xl">Extra Large</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Buttons · States</h2>
        <div class="row">
          <muk-button hasIconLeft="true" variant="primary"  >
          <i class="bi bi-search pe-2"></i> 
            

          Normal
 

          </muk-button>
          <muk-button variant="primary"  [disabled]="true">Disabled</muk-button>
          <muk-button variant="primary" [loading]="loadingBtn()" (clicked)="simulateLoading()">
            {{ loadingBtn() ? 'Loading...' : 'Click for loading' }}
          </muk-button>
        </div>
      </section>


      <!-- INPUTS -->
      <section class="card">
        <h2>Inputs · Floating Label</h2>
        <div class="grid">
         <muk-input
  label="Full Name"
  [(ngModel)]="name"
>
  <i class="bi bi-search pe-2"></i>
</muk-input>

        <muk-input label="Search" type="search" hasIconLeft="true"  [(ngModel)]="name" >
        <i slot="icon-left" class="bi bi-person-check-fill "></i>
 *   </muk-input>
<div class="red-10 ">fojkh</div>
          <muk-input
            label="Email Address"
            type="email"
            placeholder="rkh"
            [formControl]="emailCtrl"
            [readonly]="true"
          ></muk-input>

          <muk-input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            [formControl]="passwordCtrl"
            [readonly]="true"
          ></muk-input>

          <muk-input
            label="Phone"
            type="tel"
            placeholder="+94 77 123 4567"
            [(ngModel)]="phone"
          ></muk-input>
        </div>
      </section>

      <section class="card">
        <h2>Inputs · Top Label & Sizes</h2>
        <div class="grid">
          <muk-input
            label="Small"
            labelStyle="top"
            size="sm"
            placeholder="Small input"
            [(ngModel)]="topSmall"
          ></muk-input>

          <muk-input
            label="Medium"
            labelStyle="top"
            size="md"
            placeholder="Default size"
            [(ngModel)]="topMd"
          ></muk-input>

          <muk-input
            label="Large"
            labelStyle="top"
            size="lg"
            placeholder="Large input"
            [(ngModel)]="topLg"
          ></muk-input>

          <muk-input
            label="Extra Large"
            labelStyle="top"
            size="xl"
            placeholder="XL input"
            [(ngModel)]="topXl"
          ></muk-input>
        </div>
      </section>

      <section class="card">
        <h2>Inputs · States</h2>
        <div class="grid">
          <muk-input
            label="Read-only"
            [(ngModel)]="readonlyVal"
            helperText="This is read-only"
          ></muk-input>

          <muk-input
            label="Disabled"
            [(ngModel)]="disabledVal"
            [disabled]="true"
            helperText="This is disabled"
          ></muk-input>

          <muk-input
            label="Clearable"
            [(ngModel)]="clearableVal"
            placeholder="Type then clear"
            [clearable]="true"
          ></muk-input>

          <muk-input
            label="Loading (async)"
            [(ngModel)]="loadingVal"
            [loading]="true"
            helperText="Checking availability..."
          ></muk-input>
        </div>
      </section>

      <section class="card">
        <h2>Input · Textarea</h2>
        <muk-input
          label="Bio"
          type="textarea"
          [rows]="4"
          [maxLength]="200"
          [showCounter]="true"
          placeholder="Tell us about yourself..."
          helperText="A brief description"
          [(ngModel)]="bio"
        ></muk-input>
      </section>


      <!-- LOADERS -->
      <section class="card">
        <h2>Loaders · Types (Primary)</h2>
        <div class="loader-grid">
          <div class="loader-cell">
            <muk-loader type="dots" [showMessage]="false"></muk-loader>
            <span class="label">dots</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="spinner" [showMessage]="false"></muk-loader>
            <span class="label">spinner</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="pulse" [showMessage]="false"></muk-loader>
            <span class="label">pulse</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="wave" [showMessage]="false"></muk-loader>
            <span class="label">wave</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="bars" [showMessage]="false"></muk-loader>
            <span class="label">bars</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="circle" [showMessage]="false"></muk-loader>
            <span class="label">circle</span>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Loaders · Colors</h2>
        <div class="loader-grid">
          <div class="loader-cell">
            <muk-loader type="dots" color="primary" [showMessage]="false"></muk-loader>
            <span class="label">primary</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="dots" color="secondary" [showMessage]="false"></muk-loader>
            <span class="label">secondary</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="dots" color="success" [showMessage]="false"></muk-loader>
            <span class="label">success</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="dots" color="warning" [showMessage]="false"></muk-loader>
            <span class="label">warning</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="dots" color="danger" [showMessage]="false"></muk-loader>
            <span class="label">danger</span>
          </div>
          <div class="loader-cell">
            <muk-loader type="dots" color="info" [showMessage]="false"></muk-loader>
            <span class="label">info</span>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Loader · With Message</h2>
        <muk-loader type="spinner" message="Loading content"></muk-loader>
      </section>


      <!-- FORM SUBMIT DEMO -->
      <section class="card">
        <h2>Form · Submit Demo</h2>
        <p class="muted">Fill form, click Submit. Buttons enter loading state.</p>
        <div class="grid">
          <muk-input
            label="Username"
            [formControl]="usernameCtrl"
            helperText="At least 3 characters"
            placeholder="muk_user"
          ></muk-input>
          <muk-input
            label="Confirm Email"
            type="email"
            [formControl]="confirmEmailCtrl"
            placeholder="confirm&#64;example.com"
          ></muk-input>
        </div>
        <div class="row" style="margin-top: 16px;">
          <muk-button
            variant="primary"
            [loading]="submitting()"
            (clicked)="onSubmit()"
          >Submit</muk-button>
          <muk-button variant="secondary" buttonStyle="ghost" (clicked)="onReset()">
            Reset
          </muk-button>
        </div>
      </section>

      <footer class="footer muted">
        <p>All components above auto-adapt to the active theme.</p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--muk-border);
    }
    .header h1 {
      font-size: 1.625rem;
      font-weight: 700;
      margin: 0 0 6px 0;
      color: var(--muk-text);
    }
    .muted {
      color: var(--muk-text-muted);
      font-size: 0.875rem;
      margin: 0;
    }
    .theme-controls {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .seg {
      display: inline-flex;
      gap: 4px;
      padding: 4px;
      background: var(--muk-surface-muted);
      border-radius: 10px;
    }

    .card {
      background: var(--muk-surface);
      border: 1px solid var(--muk-border);
      border-radius: 14px;
      padding: 22px 24px;
      margin-bottom: 18px;
      box-shadow: var(--muk-shadow-sm);
      transition:
        background-color 0.25s ease,
        border-color 0.25s ease;
    }
    .card h2 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--muk-text-muted);
      letter-spacing: 0.02em;
      text-transform: uppercase;
      margin: 0 0 16px 0;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 10px;
    }
    .gap {
      display: inline-block;
      width: 16px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px 16px;
    }

    .loader-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }
    .loader-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 20px 12px;
      background: var(--muk-surface-sunken);
      border: 1px solid var(--muk-border-subtle);
      border-radius: 10px;
      min-height: 110px;
    }
    .loader-cell .label {
      font-size: 0.75rem;
      color: var(--muk-text-subtle);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid var(--muk-border-subtle);
    }
  `],
})
export class AppComponent {
  theme = inject(ThemeService);

  loadingBtn = signal(false);
  submitting = signal(false);

  name = '';
  phone = '';
  topSmall = '';
  topMd = '';
  topLg = '';
  topXl = '';
  readonlyVal = 'Cannot edit this';
  disabledVal = 'Disabled value';
  clearableVal = '';
  loadingVal = 'checking...';
  bio = '';

  emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  passwordCtrl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  usernameCtrl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  confirmEmailCtrl = new FormControl('', [Validators.required, Validators.email]);

  simulateLoading() {
    this.loadingBtn.set(true);
    setTimeout(() => this.loadingBtn.set(false), 1800);
  }

  onSubmit() {
    this.usernameCtrl.markAsTouched();
    this.confirmEmailCtrl.markAsTouched();
    this.submitting.set(true);
    setTimeout(() => this.submitting.set(false), 2000);
  }

  onReset() {
    this.usernameCtrl.reset();
    this.confirmEmailCtrl.reset();
    this.emailCtrl.reset();
    this.passwordCtrl.reset();
    this.name = '';
    this.phone = '';
    this.bio = '';
    this.clearableVal = '';
  }
}