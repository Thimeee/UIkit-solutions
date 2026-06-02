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
  ModalComponent,
  DialogService,
  DialogHostComponent,
  CheckboxComponent,
  SwitchComponent,
  RadioGroupComponent,
  SelectComponent,
  MukRadioOption,
  MukSelectOption,
  BadgeComponent,
  TooltipDirective,
  AccordionComponent,
  AccordionItemComponent,
  CardComponent,
  TabsComponent,
  TabComponent,
  ChipComponent,
  SkeletonComponent,
  ProgressComponent,
  StepperComponent,
  StepComponent,
  DatePickerComponent,
  TimelineComponent,
  TimelineItemComponent,
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
    ModalComponent,
    DialogHostComponent,
    CheckboxComponent,
    SwitchComponent,
    RadioGroupComponent,
    SelectComponent,
    BadgeComponent,
    TooltipDirective,
    AccordionComponent,
    AccordionItemComponent,
    CardComponent,
    TabsComponent,
    TabComponent,
    ChipComponent,
    SkeletonComponent,
    ProgressComponent,
    StepperComponent,
    StepComponent,
    DatePickerComponent,
    TimelineComponent,
    TimelineItemComponent,
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


      <!-- ═══════════ DATE PICKER ═══════════ -->
      <section class="card">
        <h2>Date Picker · Basic</h2>
        <div class="grid">
          <muk-date-picker
            label="Date of birth"
            [(ngModel)]="dpBasic"
            helperText="Select your birthday"
          ></muk-date-picker>

          <muk-date-picker
            label="Start date"
            placeholder="Pick a start date"
            [(ngModel)]="dpStart"
          ></muk-date-picker>

          <muk-date-picker
            label="With error"
            [(ngModel)]="dpErr"
            errorMessage="This field is required"
          ></muk-date-picker>

          <muk-date-picker
            label="Disabled"
            [disabled]="true"
            [(ngModel)]="dpDisabled"
          ></muk-date-picker>
        </div>
        <p class="muted" style="margin-top: 16px;">
          Selected: <strong>{{ dpBasic ? (dpBasic | date:'fullDate') : 'none' }}</strong>
        </p>
      </section>

      <section class="card">
        <h2>Date Picker · Formats</h2>
        <div class="grid">
          <muk-date-picker
            label="Sri Lankan (dd/MM/yyyy)"
            format="dd/MM/yyyy"
            [(ngModel)]="dpFmt1"
          ></muk-date-picker>
          <muk-date-picker
            label="ISO (yyyy-MM-dd)"
            format="yyyy-MM-dd"
            [(ngModel)]="dpFmt2"
          ></muk-date-picker>
          <muk-date-picker
            label="Long (MMMM d, yyyy)"
            format="MMMM d, yyyy"
            [(ngModel)]="dpFmt3"
          ></muk-date-picker>
          <muk-date-picker
            label="Short (MMM d, yy)"
            format="MMM d, yy"
            [(ngModel)]="dpFmt4"
          ></muk-date-picker>
        </div>
      </section>

      <section class="card">
        <h2>Date Picker · Constraints</h2>
        <div class="grid">
          <muk-date-picker
            label="Future appointment"
            [min]="today"
            [max]="maxAppt"
            [(ngModel)]="dpAppt"
            helperText="Within next 30 days"
          ></muk-date-picker>

          <muk-date-picker
            label="Business day only"
            [disabledDays]="[0, 6]"
            [(ngModel)]="dpBiz"
            helperText="Weekends are blocked"
          ></muk-date-picker>

          <muk-date-picker
            label="Skip 10, 15, 22"
            [disabledDateFn]="isUnavailable"
            [(ngModel)]="dpCustom"
            helperText="Custom disabled dates"
          ></muk-date-picker>

          <muk-date-picker
            label="Past dates only"
            [max]="today"
            [(ngModel)]="dpPast"
            helperText="Cannot pick future dates"
          ></muk-date-picker>
        </div>
      </section>

      <section class="card">
        <h2>Date Picker · Sizes & Label Styles</h2>
        <div class="grid">
          <muk-date-picker label="Small" size="sm" [(ngModel)]="dpSm"></muk-date-picker>
          <muk-date-picker label="Medium" size="md" [(ngModel)]="dpMd"></muk-date-picker>
          <muk-date-picker label="Large" size="lg" [(ngModel)]="dpLg"></muk-date-picker>
          <muk-date-picker label="XL" size="xl" [(ngModel)]="dpXl"></muk-date-picker>
          <muk-date-picker label="Top label style" labelStyle="top" [(ngModel)]="dpTop"></muk-date-picker>
          <muk-date-picker placeholder="No label" labelStyle="none" [(ngModel)]="dpNone"></muk-date-picker>
        </div>
      </section>


      <!-- ═══════════ TIMELINE ═══════════ -->
      <section class="card">
        <h2>Timeline · Order Tracking</h2>
        <p class="muted">Real-world example - order delivery flow with pulse on active step.</p>
        <muk-timeline>
          <muk-timeline-item
            title="Order Placed"
            time="Oct 15, 10:30 AM"
            color="success"
            [completed]="true"
          >
            Order #12345 confirmed. Total: <strong>LKR 14,500</strong>.
          </muk-timeline-item>

          <muk-timeline-item
            title="Payment Received"
            time="Oct 15, 10:32 AM"
            color="success"
            [completed]="true"
          >
            Visa ending in 4242 charged successfully.
          </muk-timeline-item>

          <muk-timeline-item
            title="Shipped"
            time="Oct 16, 9:00 AM"
            color="info"
            icon="bi bi-truck"
            [completed]="true"
          >
            Package handed to carrier. Tracking <code>#TR2025XYZ</code>.
          </muk-timeline-item>

          <muk-timeline-item
            title="Out for Delivery"
            time="Now"
            color="warning"
            icon="bi bi-geo-alt"
            [pulse]="true"
          >
            Your package is on the way! Estimated arrival in 30 mins.
          </muk-timeline-item>

          <muk-timeline-item
            title="Delivered"
            time="Pending"
            color="neutral"
          >
            Estimated delivery by Oct 18, 5:00 PM.
          </muk-timeline-item>
        </muk-timeline>
      </section>

      <section class="card">
        <h2>Timeline · Banking Audit Trail</h2>
        <p class="muted">Outline variant + small size - perfect for log/audit views.</p>
        <muk-timeline variant="outline" size="sm">
          <muk-timeline-item title="User login" time="10:30:24" color="info">
            User <strong>chanira</strong> logged in from <code>192.168.1.15</code>
          </muk-timeline-item>
          <muk-timeline-item title="Transaction approved" time="10:35:02" color="success">
            TX #9001 (LKR 50,000) approved by manager
          </muk-timeline-item>
          <muk-timeline-item title="Account modified" time="10:38:17" color="warning">
            Customer profile updated - phone number changed
          </muk-timeline-item>
          <muk-timeline-item title="Failed login attempt" time="10:42:11" color="danger">
            IP <code>45.62.117.9</code> blocked after 3 failed attempts
          </muk-timeline-item>
          <muk-timeline-item title="Logout" time="11:15:00" color="neutral">
            Session ended normally
          </muk-timeline-item>
        </muk-timeline>
      </section>

      <section class="card">
        <h2>Timeline · Variants</h2>

        <p class="muted">Filled · with icons</p>
        <muk-timeline variant="filled">
          <muk-timeline-item title="Account Created" color="success" icon="bi bi-person-plus">
            Welcome aboard!
          </muk-timeline-item>
          <muk-timeline-item title="Profile Completed" color="primary" icon="bi bi-check2">
            All details filled in.
          </muk-timeline-item>
          <muk-timeline-item title="Settings Updated" color="info" icon="bi bi-gear">
            Notification preferences saved.
          </muk-timeline-item>
        </muk-timeline>

        <p class="muted" style="margin-top: 24px;">Minimal · compact dots</p>
        <muk-timeline variant="minimal">
          <muk-timeline-item title="Step 1" color="success" [completed]="true">First action done.</muk-timeline-item>
          <muk-timeline-item title="Step 2" color="primary">Second action in progress.</muk-timeline-item>
          <muk-timeline-item title="Step 3" color="neutral">Last action queued.</muk-timeline-item>
        </muk-timeline>

        <p class="muted" style="margin-top: 24px;">Dashed connector</p>
        <muk-timeline connector="dashed">
          <muk-timeline-item title="Started" color="success" [completed]="true">Project kickoff</muk-timeline-item>
          <muk-timeline-item title="In Review" color="warning">Awaiting approval</muk-timeline-item>
          <muk-timeline-item title="Approved" color="neutral">Pending</muk-timeline-item>
        </muk-timeline>
      </section>

      <section class="card">
        <h2>Timeline · Alternate (zig-zag) with left content</h2>
        <muk-timeline align="alternate">
          <muk-timeline-item title="Q1 2025" color="success" [completed]="true">
            <span slot="left">Jan - Mar</span>
            Launched the new product line. Expanded to 3 new countries.
          </muk-timeline-item>
          <muk-timeline-item title="Q2 2025" color="primary" [completed]="true">
            <span slot="left">Apr - Jun</span>
            Onboarded 500+ new clients. Released v2.0 of the platform.
          </muk-timeline-item>
          <muk-timeline-item title="Q3 2025" color="info" [pulse]="true">
            <span slot="left">Jul - Sep</span>
            Currently in this quarter - mid-year review underway.
          </muk-timeline-item>
          <muk-timeline-item title="Q4 2025" color="neutral">
            <span slot="left">Oct - Dec</span>
            Year-end planning and roadmap for 2026.
          </muk-timeline-item>
        </muk-timeline>
      </section>

      <section class="card">
        <h2>Timeline · Inside a Card (activity feed)</h2>
        <muk-card variant="elevated">
          <div slot="header" style="display: flex; align-items: center; justify-content: space-between;">
            <h4 style="margin: 0;">Recent Activity</h4>
            <muk-badge variant="primary" size="sm" shape="pill">Live</muk-badge>
          </div>
          <muk-timeline variant="filled" size="sm">
            <muk-timeline-item title="John commented" time="2m ago" color="primary">
              "Looks great! Ready to ship 🚀"
            </muk-timeline-item>
            <muk-timeline-item title="Sarah uploaded a file" time="5m ago" color="info">
              <code>design-v2.fig</code>
            </muk-timeline-item>
            <muk-timeline-item title="Mike completed task" time="1h ago" color="success" [completed]="true">
              Review pull request #42
            </muk-timeline-item>
            <muk-timeline-item title="Build failed" time="2h ago" color="danger" icon="bi bi-x-circle">
              CI pipeline failed on stage <code>test</code>
            </muk-timeline-item>
          </muk-timeline>
        </muk-card>
      </section>


      <!-- ═══════════ STEPPER ═══════════ -->
      <section class="card">
        <h2>Stepper · Checkout Wizard</h2>
        <p class="muted">Multi-step flow. Use buttons or click steps to navigate.</p>
        <muk-stepper [(activeIndex)]="checkoutStep">
          <muk-step label="Account" icon="bi bi-person" description="Your info">
            <h4 style="margin: 0 0 8px;">Step 1 — Account</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Enter your account details.</p>
          </muk-step>
          <muk-step label="Address" icon="bi bi-geo-alt" description="Where to ship">
            <h4 style="margin: 0 0 8px;">Step 2 — Address</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Confirm your shipping address.</p>
          </muk-step>
          <muk-step label="Payment" icon="bi bi-credit-card" description="Card details">
            <h4 style="margin: 0 0 8px;">Step 3 — Payment</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Enter your card information.</p>
          </muk-step>
          <muk-step label="Review" icon="bi bi-check2-circle">
            <h4 style="margin: 0 0 8px;">Step 4 — Review</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Confirm everything looks right.</p>
          </muk-step>
        </muk-stepper>

        <div class="row" style="margin-top: 24px;">
          <muk-button
            size="sm"
            variant="secondary"
            buttonStyle="ghost"
            [disabled]="checkoutStep === 0"
            (clicked)="checkoutStep = checkoutStep - 1"
          >
            <i slot="icon-left" class="bi bi-arrow-left"></i>
            Back
          </muk-button>
          <muk-button
            size="sm"
            variant="primary"
            [disabled]="checkoutStep === 3"
            (clicked)="checkoutStep = checkoutStep + 1"
          >
            Next
            <i slot="icon-right" class="bi bi-arrow-right"></i>
          </muk-button>
          <muk-button size="sm" buttonStyle="ghost" (clicked)="checkoutStep = 0">Reset</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Stepper · Variants</h2>

        <p class="muted">Default</p>
        <muk-stepper [activeIndex]="1">
          <muk-step label="One">Content 1</muk-step>
          <muk-step label="Two">Content 2</muk-step>
          <muk-step label="Three">Content 3</muk-step>
        </muk-stepper>

        <p class="muted" style="margin-top: 24px;">Filled variant + dashed connectors</p>
        <muk-stepper variant="filled" connector="dashed" [activeIndex]="2">
          <muk-step label="Start" icon="bi bi-play">Start</muk-step>
          <muk-step label="Process" icon="bi bi-gear">Process</muk-step>
          <muk-step label="Finish" icon="bi bi-flag">Finish</muk-step>
        </muk-stepper>

        <p class="muted" style="margin-top: 24px;">With error state</p>
        <muk-stepper [activeIndex]="2">
          <muk-step label="Account">Account</muk-step>
          <muk-step label="Profile">Profile</muk-step>
          <muk-step label="Payment" [error]="true" description="Card declined">Payment</muk-step>
          <muk-step label="Done">Done</muk-step>
        </muk-stepper>
      </section>

      <section class="card">
        <h2>Stepper · Vertical orientation</h2>
        <muk-stepper orientation="vertical" [(activeIndex)]="vStep">
          <muk-step label="Choose Plan" icon="bi bi-box-seam" description="Pro plan selected">
            <p>Pro Plan — $29/month with unlimited features.</p>
          </muk-step>
          <muk-step label="Add Payment" icon="bi bi-credit-card" description="Visa •••• 4242">
            <p>Payment method confirmed.</p>
          </muk-step>
          <muk-step label="Confirm" icon="bi bi-check-circle">
            <p>Review and confirm your subscription.</p>
          </muk-step>
        </muk-stepper>
      </section>


      <!-- ═══════════ PROGRESS BAR ═══════════ -->
      <section class="card">
        <h2>Progress · Linear</h2>
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <muk-progress [value]="25"></muk-progress>
          <muk-progress [value]="55" variant="success" [showLabel]="true"></muk-progress>
          <muk-progress [value]="75" variant="warning" label="Uploading files" [showLabel]="true" helperText="3 of 5 files complete"></muk-progress>
          <muk-progress [value]="40" variant="danger" [striped]="true" [animated]="true"></muk-progress>
          <muk-progress [indeterminate]="true" variant="info"></muk-progress>
        </div>
        <p class="muted" style="margin-top: 20px;">Sizes</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <muk-progress [value]="60" size="sm"></muk-progress>
          <muk-progress [value]="60" size="md"></muk-progress>
          <muk-progress [value]="60" size="lg" [showLabel]="true"></muk-progress>
          <muk-progress [value]="60" size="xl" [showLabel]="true"></muk-progress>
        </div>
      </section>

      <section class="card">
        <h2>Progress · Interactive</h2>
        <p class="muted">Adjust the value with buttons.</p>
        <muk-progress
          [value]="progValue"
          variant="primary"
          [showLabel]="true"
          label="Download progress"
          helperText="Click buttons to change"
        ></muk-progress>
        <div class="row" style="margin-top: 16px;">
          <muk-button size="sm" buttonStyle="soft" (clicked)="progValue = Math.max(0, progValue - 10)">-10</muk-button>
          <muk-button size="sm" buttonStyle="soft" (clicked)="progValue = Math.min(100, progValue + 10)">+10</muk-button>
          <muk-button size="sm" variant="secondary" buttonStyle="ghost" (clicked)="progValue = 0">Reset</muk-button>
          <muk-button size="sm" variant="success" (clicked)="progValue = 100">Complete</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Progress · Circular</h2>
        <div class="row" style="align-items: center; gap: 32px;">
          <div style="text-align: center;">
            <muk-progress type="circular" [value]="25"></muk-progress>
            <p class="muted" style="margin: 8px 0 0;">Default</p>
          </div>
          <div style="text-align: center;">
            <muk-progress type="circular" [value]="60" [showLabel]="true" variant="success"></muk-progress>
            <p class="muted" style="margin: 8px 0 0;">With label</p>
          </div>
          <div style="text-align: center;">
            <muk-progress type="circular" [value]="80" [showLabel]="true" size="lg" variant="warning"></muk-progress>
            <p class="muted" style="margin: 8px 0 0;">Large</p>
          </div>
          <div style="text-align: center;">
            <muk-progress type="circular" [value]="45" [showLabel]="true" size="xl" variant="danger"></muk-progress>
            <p class="muted" style="margin: 8px 0 0;">XL</p>
          </div>
          <div style="text-align: center;">
            <muk-progress type="circular" [indeterminate]="true" size="lg" variant="info"></muk-progress>
            <p class="muted" style="margin: 8px 0 0;">Indeterminate</p>
          </div>
        </div>
      </section>


      <!-- ═══════════ CHIP / TAG ═══════════ -->
      <section class="card">
        <h2>Chip · Variants</h2>
        <div class="row">
          <muk-chip variant="neutral">Neutral</muk-chip>
          <muk-chip variant="primary">Primary</muk-chip>
          <muk-chip variant="success">Success</muk-chip>
          <muk-chip variant="warning">Warning</muk-chip>
          <muk-chip variant="danger">Danger</muk-chip>
          <muk-chip variant="info">Info</muk-chip>
          <muk-chip variant="secondary">Secondary</muk-chip>
        </div>
        <p class="muted" style="margin-top: 16px;">Styles</p>
        <div class="row">
          <muk-chip variant="success" chipStyle="solid">Solid</muk-chip>
          <muk-chip variant="success" chipStyle="soft">Soft</muk-chip>
          <muk-chip variant="success" chipStyle="outline">Outline</muk-chip>
        </div>
        <p class="muted" style="margin-top: 16px;">Sizes & Shapes</p>
        <div class="row" style="align-items: center;">
          <muk-chip variant="primary" size="sm">Small</muk-chip>
          <muk-chip variant="primary" size="md">Medium</muk-chip>
          <muk-chip variant="primary" size="lg">Large</muk-chip>
          <span class="gap"></span>
          <muk-chip variant="info" shape="rounded">Rounded</muk-chip>
          <muk-chip variant="info" shape="pill">Pill</muk-chip>
          <muk-chip variant="info" shape="square">Square</muk-chip>
        </div>
        <p class="muted" style="margin-top: 16px;">With icon & avatar</p>
        <div class="row" style="align-items: center;">
          <muk-chip variant="success">
            <i slot="icon" class="bi bi-check-circle-fill"></i>
            Verified
          </muk-chip>
          <muk-chip variant="warning" chipStyle="soft">
            <i slot="icon" class="bi bi-clock"></i>
            Pending
          </muk-chip>
          <muk-chip>
            <img slot="avatar" src="https://i.pravatar.cc/40?img=12" alt="" />
            John Doe
          </muk-chip>
          <muk-chip variant="primary">
            <img slot="avatar" src="https://i.pravatar.cc/40?img=5" alt="" />
            Sarah Lee
          </muk-chip>
        </div>
      </section>

      <section class="card">
        <h2>Chip · Removable Tags</h2>
        <p class="muted">Click X to remove. Click "Reset" to bring them back.</p>
        <div class="row" style="min-height: 36px;">
          @for (tag of activeTags; track tag) {
            <muk-chip
              variant="primary"
              chipStyle="soft"
              [removable]="true"
              (removed)="removeTag(tag)"
            >{{ tag }}</muk-chip>
          }
          @if (activeTags.length === 0) {
            <p class="muted" style="margin: 0;">All tags removed.</p>
          }
        </div>
        <div class="row" style="margin-top: 16px;">
          <muk-button size="sm" buttonStyle="ghost" (clicked)="resetTags()">Reset Tags</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Chip · Filter Pills (clickable + selected)</h2>
        <p class="muted">Active filter: <strong>{{ activeFilter }}</strong></p>
        <div class="row">
          @for (f of filterOptions; track f) {
            <muk-chip
              [clickable]="true"
              [selected]="activeFilter === f"
              (clicked)="activeFilter = f"
              variant="primary"
              chipStyle="soft"
              shape="pill"
            >{{ f }}</muk-chip>
          }
        </div>
      </section>


      <!-- ═══════════ SKELETON ═══════════ -->
      <section class="card">
        <h2>Skeleton · Shapes</h2>
        <p class="muted">Loading placeholders. Pulse animation by default.</p>
        <div class="grid">
          <div>
            <p class="muted" style="margin: 0 0 8px;">Text</p>
            <muk-skeleton variant="text" width="80%"></muk-skeleton>
          </div>
          <div>
            <p class="muted" style="margin: 0 0 8px;">Multiple lines (3)</p>
            <muk-skeleton variant="text" [lines]="3"></muk-skeleton>
          </div>
          <div>
            <p class="muted" style="margin: 0 0 8px;">Circle</p>
            <muk-skeleton variant="circle" width="56px" height="56px"></muk-skeleton>
          </div>
          <div>
            <p class="muted" style="margin: 0 0 8px;">Rounded rectangle</p>
            <muk-skeleton variant="rounded" width="100%" height="80px"></muk-skeleton>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Skeleton · Animations</h2>
        <div class="grid">
          <div>
            <p class="muted" style="margin: 0 0 8px;">Pulse (default)</p>
            <muk-skeleton variant="rounded" height="60px" animation="pulse"></muk-skeleton>
          </div>
          <div>
            <p class="muted" style="margin: 0 0 8px;">Wave (shimmer)</p>
            <muk-skeleton variant="rounded" height="60px" animation="wave"></muk-skeleton>
          </div>
          <div>
            <p class="muted" style="margin: 0 0 8px;">None</p>
            <muk-skeleton variant="rounded" height="60px" animation="none"></muk-skeleton>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Skeleton · Real-world Composition</h2>
        <p class="muted">Toggle to see how skeletons replace real content during loading.</p>
        <div class="row" style="margin-bottom: 16px;">
          <muk-button size="sm" (clicked)="contentLoading = !contentLoading">
            {{ contentLoading ? 'Show Content' : 'Show Skeleton' }}
          </muk-button>
        </div>
        <div class="grid">
          <muk-card variant="elevated">
            @if (contentLoading) {
              <muk-skeleton variant="rounded" height="160px"></muk-skeleton>
              <div style="display: flex; gap: 12px; margin-top: 14px;">
                <muk-skeleton variant="circle" width="44px" height="44px"></muk-skeleton>
                <div style="flex: 1;">
                  <muk-skeleton variant="text" width="55%"></muk-skeleton>
                  <muk-skeleton variant="text" [lines]="2" lastLineWidth="40%"></muk-skeleton>
                </div>
              </div>
            } @else {
              <div style="background: linear-gradient(135deg, var(--muk-primary-user), #6366f1); height: 160px; border-radius: 8px;"></div>
              <div style="display: flex; gap: 12px; margin-top: 14px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--muk-primary-user);"></div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 4px;">Beautiful Sunset</h4>
                  <p style="margin: 0; color: var(--muk-text-muted); font-size: 0.875rem;">
                    Posted by Sarah · 2 hours ago. A stunning view from the beach.
                  </p>
                </div>
              </div>
            }
          </muk-card>

          <muk-card variant="elevated">
            @if (contentLoading) {
              <muk-skeleton variant="text" width="40%"></muk-skeleton>
              <muk-skeleton variant="text" [lines]="4" lastLineWidth="60%"></muk-skeleton>
              <div style="display: flex; gap: 8px; margin-top: 16px;">
                <muk-skeleton variant="rounded" width="80px" height="32px"></muk-skeleton>
                <muk-skeleton variant="rounded" width="80px" height="32px"></muk-skeleton>
              </div>
            } @else {
              <h4 style="margin: 0 0 8px;">Article Title</h4>
              <p style="margin: 0 0 8px; color: var(--muk-text-muted); font-size: 0.875rem;">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <div style="display: flex; gap: 8px;">
                <muk-button size="sm" variant="primary">Read</muk-button>
                <muk-button size="sm" buttonStyle="ghost">Save</muk-button>
              </div>
            }
          </muk-card>
        </div>
      </section>


      <!-- ═══════════ CARD ═══════════ -->
      <section class="card">
        <h2>Card · Variants</h2>
        <div class="grid">
          <muk-card variant="default">
            <h4 style="margin: 0 0 8px;">Default</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Simple border, plain background.</p>
          </muk-card>
          <muk-card variant="bordered">
            <h4 style="margin: 0 0 8px;">Bordered</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Stronger border for emphasis.</p>
          </muk-card>
          <muk-card variant="elevated">
            <h4 style="margin: 0 0 8px;">Elevated</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Drop shadow, no border.</p>
          </muk-card>
          <muk-card variant="filled">
            <h4 style="margin: 0 0 8px;">Filled</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Tinted background.</p>
          </muk-card>
          <muk-card variant="ghost">
            <h4 style="margin: 0 0 8px;">Ghost</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Transparent, no border.</p>
          </muk-card>
        </div>
      </section>

      <section class="card">
        <h2>Card · Hover Effects</h2>
        <p class="muted">Hover over each card to see the effect.</p>
        <div class="grid">
          <muk-card variant="elevated" hoverEffect="lift">
            <h4 style="margin: 0 0 8px;">Lift</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Rises with stronger shadow.</p>
          </muk-card>
          <muk-card variant="elevated" hoverEffect="glow">
            <h4 style="margin: 0 0 8px;">Glow</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Colored halo + primary border.</p>
          </muk-card>
          <muk-card variant="elevated" hoverEffect="zoom">
            <h4 style="margin: 0 0 8px;">Zoom</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Subtle scale-up effect.</p>
          </muk-card>
          <muk-card variant="bordered" hoverEffect="border">
            <h4 style="margin: 0 0 8px;">Border</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Border turns primary.</p>
          </muk-card>
        </div>
      </section>

      <section class="card">
        <h2>Card · Structured (slots)</h2>
        <div class="grid">
          <muk-card variant="elevated" hoverEffect="lift">
            <div slot="header" style="display: flex; align-items: center; justify-content: space-between;">
              <h4 style="margin: 0;">Subscription</h4>
              <muk-badge variant="success" size="sm" shape="pill">Active</muk-badge>
            </div>
            Pro plan · $29/month. Renews on June 15.
            <div slot="footer">
              <muk-button variant="primary" size="sm">Upgrade</muk-button>
              <muk-button variant="secondary" buttonStyle="ghost" size="sm">Cancel</muk-button>
            </div>
          </muk-card>

          <muk-card title="Quick Stats" subtitle="Last 30 days" variant="elevated">
            <div style="display: flex; gap: 24px; padding: 8px 0;">
              <div>
                <div style="font-size: 1.75rem; font-weight: 700;">2.4k</div>
                <div style="color: var(--muk-text-muted); font-size: 0.8125rem;">Users</div>
              </div>
              <div>
                <div style="font-size: 1.75rem; font-weight: 700; color: var(--muk-primary-user);">+12%</div>
                <div style="color: var(--muk-text-muted); font-size: 0.8125rem;">Growth</div>
              </div>
            </div>
          </muk-card>

          <muk-card [clickable]="true" hoverEffect="lift" (clicked)="onCardClick()" variant="elevated">
            <h4 style="margin: 0 0 8px;">Clickable Card</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Click anywhere on me!</p>
            @if (cardClicks > 0) {
              <p style="margin: 8px 0 0; color: var(--muk-primary-user); font-weight: 500;">
                Clicked {{ cardClicks }} time(s)
              </p>
            }
          </muk-card>
        </div>
      </section>

      <section class="card">
        <h2>Card · States</h2>
        <div class="grid">
          <muk-card variant="elevated" [disabled]="true">
            <h4 style="margin: 0 0 8px;">Disabled</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Cannot interact with this card.</p>
          </muk-card>
          <muk-card variant="elevated" [loading]="cardLoading">
            <h4 style="margin: 0 0 8px;">Loading State</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Spinner overlay appears.</p>
            <div slot="footer">
              <muk-button size="sm" (clicked)="toggleCardLoading()">
                {{ cardLoading ? 'Stop' : 'Start' }} Loading
              </muk-button>
            </div>
          </muk-card>
          <muk-card variant="elevated" [selected]="cardSelected" [clickable]="true" (clicked)="cardSelected = !cardSelected">
            <h4 style="margin: 0 0 8px;">Selected</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Click to toggle selected state.</p>
          </muk-card>
        </div>
      </section>


      <!-- ═══════════ TABS ═══════════ -->
      <section class="card">
        <h2>Tabs · All Variants</h2>
        <p class="muted">5 styles for different contexts.</p>

        <p class="muted" style="margin-top: 16px;">Line (default - classic)</p>
        <muk-tabs variant="line">
          <muk-tab label="Overview">Overview content here.</muk-tab>
          <muk-tab label="Reports">Reports content here.</muk-tab>
          <muk-tab label="Settings">Settings content here.</muk-tab>
        </muk-tabs>

        <p class="muted" style="margin-top: 24px;">Pills</p>
        <muk-tabs variant="pills">
          <muk-tab label="Overview">Pills variant — rounded buttons.</muk-tab>
          <muk-tab label="Reports">Reports content.</muk-tab>
          <muk-tab label="Settings">Settings content.</muk-tab>
        </muk-tabs>

        <p class="muted" style="margin-top: 24px;">Segmented</p>
        <muk-tabs variant="segmented">
          <muk-tab label="Day">Today's view.</muk-tab>
          <muk-tab label="Week">Weekly view.</muk-tab>
          <muk-tab label="Month">Monthly view.</muk-tab>
          <muk-tab label="Year">Yearly view.</muk-tab>
        </muk-tabs>

        <p class="muted" style="margin-top: 24px;">Enclosed</p>
        <muk-tabs variant="enclosed">
          <muk-tab label="HTML">HTML content.</muk-tab>
          <muk-tab label="CSS">CSS content.</muk-tab>
          <muk-tab label="JS">JS content.</muk-tab>
        </muk-tabs>

        <p class="muted" style="margin-top: 24px;">Soft</p>
        <muk-tabs variant="soft">
          <muk-tab label="Inbox">Inbox messages.</muk-tab>
          <muk-tab label="Sent">Sent messages.</muk-tab>
          <muk-tab label="Drafts">Draft messages.</muk-tab>
        </muk-tabs>
      </section>

      <section class="card">
        <h2>Tabs · With Icons & Badges</h2>
        <muk-tabs variant="pills">
          <muk-tab label="Profile" icon="bi bi-person">
            Manage your profile information and avatar.
          </muk-tab>
          <muk-tab label="Notifications" icon="bi bi-bell" badge="5">
            You have <strong>5 unread</strong> notifications.
          </muk-tab>
          <muk-tab label="Messages" icon="bi bi-chat-dots" badge="12">
            You have 12 new messages waiting.
          </muk-tab>
          <muk-tab label="Settings" icon="bi bi-gear">
            Configure app preferences.
          </muk-tab>
          <muk-tab label="Locked" icon="bi bi-lock" [disabled]="true">
            Cannot reach here.
          </muk-tab>
        </muk-tabs>
      </section>

      <section class="card">
        <h2>Tabs · Animations</h2>
        <p class="muted">Each row uses a different entrance animation.</p>

        <p class="muted" style="margin-top: 16px;">Fade (default)</p>
        <muk-tabs variant="soft" animation="fade">
          <muk-tab label="One">Fade in content 1.</muk-tab>
          <muk-tab label="Two">Fade in content 2.</muk-tab>
          <muk-tab label="Three">Fade in content 3.</muk-tab>
        </muk-tabs>

        <p class="muted" style="margin-top: 24px;">Slide</p>
        <muk-tabs variant="soft" animation="slide">
          <muk-tab label="One">Slide in content 1.</muk-tab>
          <muk-tab label="Two">Slide in content 2.</muk-tab>
          <muk-tab label="Three">Slide in content 3.</muk-tab>
        </muk-tabs>

        <p class="muted" style="margin-top: 24px;">Scale</p>
        <muk-tabs variant="soft" animation="scale">
          <muk-tab label="One">Scale in content 1.</muk-tab>
          <muk-tab label="Two">Scale in content 2.</muk-tab>
          <muk-tab label="Three">Scale in content 3.</muk-tab>
        </muk-tabs>
      </section>

      <section class="card">
        <h2>Tabs · Two-way binding</h2>
        <p class="muted">Current value: <strong>{{ tabValue }}</strong></p>
        <muk-tabs [(value)]="tabValue" variant="segmented" [fullWidth]="true">
          <muk-tab value="overview" label="Overview" icon="bi bi-house">Overview content</muk-tab>
          <muk-tab value="reports" label="Reports" icon="bi bi-bar-chart">Reports content</muk-tab>
          <muk-tab value="users" label="Users" icon="bi bi-people" badge="24">Users content</muk-tab>
        </muk-tabs>
        <div class="row" style="margin-top: 16px;">
          <muk-button size="sm" buttonStyle="soft" (clicked)="tabValue = 'overview'">Go to Overview</muk-button>
          <muk-button size="sm" buttonStyle="soft" (clicked)="tabValue = 'reports'">Go to Reports</muk-button>
          <muk-button size="sm" buttonStyle="soft" (clicked)="tabValue = 'users'">Go to Users</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Tabs · Vertical orientation</h2>
        <muk-tabs orientation="vertical" variant="soft" animation="slide">
          <muk-tab label="General" icon="bi bi-sliders">
            <h4 style="margin: 0 0 8px;">General Settings</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Language, timezone, display preferences.</p>
          </muk-tab>
          <muk-tab label="Account" icon="bi bi-person">
            <h4 style="margin: 0 0 8px;">Account</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Email, password, profile information.</p>
          </muk-tab>
          <muk-tab label="Security" icon="bi bi-shield-lock">
            <h4 style="margin: 0 0 8px;">Security</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Two-factor authentication, active sessions.</p>
          </muk-tab>
          <muk-tab label="Notifications" icon="bi bi-bell" badge="3">
            <h4 style="margin: 0 0 8px;">Notifications</h4>
            <p style="margin: 0; color: var(--muk-text-muted);">Email, push, and in-app alerts.</p>
          </muk-tab>
        </muk-tabs>
      </section>

      <section class="card">
        <h2>Card + Tabs · Combined</h2>
        <p class="muted">Real-world pattern - dashboard card with tabs inside.</p>
        <muk-card variant="elevated">
          <div slot="header" style="display: flex; align-items: center; justify-content: space-between;">
            <h4 style="margin: 0;">Activity Dashboard</h4>
            <muk-badge variant="primary" size="sm" shape="pill">Live</muk-badge>
          </div>
          <muk-tabs variant="line">
            <muk-tab label="Recent" icon="bi bi-clock-history">
              <p>Recent activity from the last 24 hours.</p>
            </muk-tab>
            <muk-tab label="Statistics" icon="bi bi-graph-up">
              <p>Performance metrics and trends.</p>
            </muk-tab>
            <muk-tab label="Logs" icon="bi bi-list-ul" badge="42">
              <p>System logs and audit trail.</p>
            </muk-tab>
          </muk-tabs>
        </muk-card>
      </section>


      <!-- ═══════════ BADGE ═══════════ -->
      <section class="card">
        <h2>Badge · Inline Labels</h2>
        <div class="row" style="align-items: center;">
          <muk-badge variant="primary">Primary</muk-badge>
          <muk-badge variant="success">Active</muk-badge>
          <muk-badge variant="warning">Pending</muk-badge>
          <muk-badge variant="danger">Failed</muk-badge>
          <muk-badge variant="info">New</muk-badge>
          <muk-badge variant="secondary">Draft</muk-badge>
          <muk-badge variant="light">Light</muk-badge>
          <muk-badge variant="dark">Dark</muk-badge>
        </div>
        <p class="muted" style="margin-top: 16px;">Styles</p>
        <div class="row" style="align-items: center;">
          <muk-badge variant="success" badgeStyle="solid">Solid</muk-badge>
          <muk-badge variant="success" badgeStyle="soft">Soft</muk-badge>
          <muk-badge variant="success" badgeStyle="outline">Outline</muk-badge>
        </div>
        <p class="muted" style="margin-top: 16px;">Shapes & sizes</p>
        <div class="row" style="align-items: center;">
          <muk-badge variant="info" shape="rounded">Rounded</muk-badge>
          <muk-badge variant="info" shape="pill">Pill</muk-badge>
          <muk-badge variant="info" shape="square">Square</muk-badge>
          <span class="gap"></span>
          <muk-badge variant="primary" size="sm">Small</muk-badge>
          <muk-badge variant="primary" size="md">Medium</muk-badge>
          <muk-badge variant="primary" size="lg">Large</muk-badge>
        </div>
        <p class="muted" style="margin-top: 16px;">With icon</p>
        <div class="row" style="align-items: center;">
          <muk-badge variant="success">
            <i slot="icon" class="bi bi-check-circle-fill"></i>
            Verified
          </muk-badge>
          <muk-badge variant="danger" badgeStyle="soft">
            <i slot="icon" class="bi bi-x-circle-fill"></i>
            Rejected
          </muk-badge>
          <muk-badge variant="warning" shape="pill">
            <i slot="icon" class="bi bi-clock-fill"></i>
            Waiting
          </muk-badge>
        </div>
      </section>

      <section class="card">
        <h2>Badge · Notification Overlays</h2>
        <p class="muted">Dot, count, and pulse animation wrap a target element.</p>
        <div class="row" style="align-items: center; gap: 32px;">
          <muk-badge [dot]="true" variant="danger">
            <i class="bi bi-bell" style="font-size: 1.5rem; color: var(--muk-text-muted);"></i>
          </muk-badge>

          <muk-badge [dot]="true" variant="success" [pulse]="true">
            <i class="bi bi-broadcast" style="font-size: 1.5rem; color: var(--muk-text-muted);"></i>
          </muk-badge>

          <muk-badge [count]="3" variant="danger">
            <i class="bi bi-envelope-fill" style="font-size: 1.5rem; color: var(--muk-text-muted);"></i>
          </muk-badge>

          <muk-badge [count]="12" variant="primary">
            <i class="bi bi-chat-dots-fill" style="font-size: 1.5rem; color: var(--muk-text-muted);"></i>
          </muk-badge>

          <muk-badge [count]="150" [max]="99" variant="danger">
            <i class="bi bi-bell-fill" style="font-size: 1.5rem; color: var(--muk-text-muted);"></i>
          </muk-badge>

          <muk-badge [count]="0" variant="danger">
            <i class="bi bi-cart" style="font-size: 1.5rem; color: var(--muk-text-muted);"></i>
            <span style="margin-left: 4px; font-size: 0.875rem;">(hides 0)</span>
          </muk-badge>
        </div>
      </section>


      <!-- ═══════════ TOOLTIP ═══════════ -->
      <section class="card">
        <h2>Tooltip · Positions</h2>
        <p class="muted">Hover any button to see the tooltip.</p>
        <div class="row">
          <muk-button buttonStyle="soft" mukTooltip="Tooltip on top" tooltipPosition="top">Top</muk-button>
          <muk-button buttonStyle="soft" mukTooltip="Tooltip on right" tooltipPosition="right">Right</muk-button>
          <muk-button buttonStyle="soft" mukTooltip="Tooltip on bottom" tooltipPosition="bottom">Bottom</muk-button>
          <muk-button buttonStyle="soft" mukTooltip="Tooltip on left" tooltipPosition="left">Left</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Tooltip · Variants</h2>
        <div class="row">
          <muk-button buttonStyle="outline" mukTooltip="Dark tooltip (default)" tooltipVariant="dark">Dark</muk-button>
          <muk-button buttonStyle="outline" mukTooltip="Light tooltip" tooltipVariant="light">Light</muk-button>
          <muk-button buttonStyle="outline" mukTooltip="Brand colored" tooltipVariant="primary">Primary</muk-button>
          <muk-button buttonStyle="outline" mukTooltip="All good!" tooltipVariant="success">Success</muk-button>
          <muk-button buttonStyle="outline" mukTooltip="Be careful" tooltipVariant="warning">Warning</muk-button>
          <muk-button buttonStyle="outline" mukTooltip="Cannot be undone" tooltipVariant="danger">Danger</muk-button>
          <muk-button buttonStyle="outline" mukTooltip="Did you know?" tooltipVariant="info">Info</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Tooltip · Triggers & Manual</h2>
        <div class="row" style="align-items: center;">
          <muk-button variant="primary" mukTooltip="Hover me (default)">Hover</muk-button>
          <muk-button variant="primary" mukTooltip="Click to toggle" tooltipTrigger="click">Click</muk-button>
          <muk-button variant="primary" mukTooltip="Focused via keyboard" tooltipTrigger="focus">Focus</muk-button>
          <span class="gap"></span>
          <!-- Manual trigger via template ref -->
          <span
            #tip="mukTooltip"
            mukTooltip="Controlled programmatically"
            tooltipTrigger="manual"
            tooltipVariant="primary"
            style="display: inline-block; padding: 6px 10px; background: var(--muk-surface-muted); border-radius: 6px;"
          >Manual target</span>
          <muk-button size="sm" variant="success" (clicked)="tip.show()">Show</muk-button>
          <muk-button size="sm" variant="danger" buttonStyle="ghost" (clicked)="tip.hide()">Hide</muk-button>
        </div>
        <p class="muted" style="margin-top: 16px;">Also works on any element:</p>
        <p>
          Hover this icon →
          <i
            class="bi bi-info-circle-fill"
            mukTooltip="Tooltips work on plain elements too!"
            tooltipVariant="info"
            style="color: var(--muk-primary-user); font-size: 1.25rem; cursor: help;"
          ></i>
        </p>
      </section>


      <!-- ═══════════ ACCORDION ═══════════ -->
      <section class="card">
        <h2>Accordion · Default (multiple open)</h2>
        <muk-accordion>
          <muk-accordion-item title="What is MUK UI Kit?" [defaultOpen]="true">
            A modern, theme-aware Angular component library built for the MCS ecosystem.
            All components support light and dark mode out of the box.
          </muk-accordion-item>
          <muk-accordion-item title="How do I install it?">
            Add the library to your Angular workspace and import components from
            <code>'multi-ui-kit'</code>. See the README for full setup.
          </muk-accordion-item>
          <muk-accordion-item title="Does it support dark mode?">
            Yes — three modes are available: <strong>light</strong>, <strong>dark</strong>,
            and <strong>auto</strong> (follows OS preference). The selection is persisted.
          </muk-accordion-item>
          <muk-accordion-item title="Disabled section" [disabled]="true">
            Cannot expand this one.
          </muk-accordion-item>
        </muk-accordion>
      </section>

      <section class="card">
        <h2>Accordion · Single-open · Bordered</h2>
        <muk-accordion [multiple]="false" variant="bordered">
          <muk-accordion-item title="Section 1">
            Only one section can be open at a time. Opening this closes the others.
          </muk-accordion-item>
          <muk-accordion-item title="Section 2">
            Try clicking — Section 1 will close automatically.
          </muk-accordion-item>
          <muk-accordion-item title="Section 3">
            And the same here.
          </muk-accordion-item>
        </muk-accordion>
      </section>

      <section class="card">
        <h2>Accordion · Filled variant · With icons</h2>
        <muk-accordion variant="filled">
          <muk-accordion-item title="Account Settings" icon="bi bi-person-circle">
            Manage your profile, email, and personal information.
          </muk-accordion-item>
          <muk-accordion-item title="Security" icon="bi bi-shield-lock">
            Change password, enable two-factor authentication.
          </muk-accordion-item>
          <muk-accordion-item title="Notifications" icon="bi bi-bell">
            Configure email, push, and in-app notifications.
          </muk-accordion-item>
        </muk-accordion>
      </section>

      <section class="card">
        <h2>Accordion · Separated · Custom header with badge</h2>
        <muk-accordion variant="separated">
          <muk-accordion-item>
            <div slot="header" style="display: flex; align-items: center; gap: 10px;">
              <i class="bi bi-inbox"></i>
              <span>Inbox</span>
              <muk-badge variant="danger" size="sm" shape="pill">3 new</muk-badge>
            </div>
            You have 3 unread messages.
          </muk-accordion-item>
          <muk-accordion-item>
            <div slot="header" style="display: flex; align-items: center; gap: 10px;">
              <i class="bi bi-archive"></i>
              <span>Archive</span>
              <muk-badge variant="secondary" size="sm" badgeStyle="soft">128</muk-badge>
            </div>
            Archived items will appear here.
          </muk-accordion-item>
        </muk-accordion>
      </section>


      <!-- ═══════════ SELECT / DROPDOWN ═══════════ -->
      <section class="card">
        <h2>Select · Single + Multi + Search</h2>
        <div class="grid">
          <muk-select
            label="Country"
            placeholder="Pick your country"
            [options]="countries"
            [(ngModel)]="country"
            helperText="Single select"
          ></muk-select>

          <muk-select
            label="Skills"
            placeholder="Select skills"
            [options]="skills"
            [multiple]="true"
            [searchable]="true"
            [(ngModel)]="selectedSkills"
            helperText="Multi-select with search"
          ></muk-select>

          <muk-select
            label="Framework (grouped)"
            [options]="frameworks"
            [searchable]="true"
            [(ngModel)]="framework"
          ></muk-select>

          <muk-select
            label="Plan (with descriptions)"
            [options]="plans"
            [(ngModel)]="plan"
            size="lg"
          ></muk-select>
        </div>
      </section>


      <!-- ═══════════ CHECKBOX / SWITCH / RADIO ═══════════ -->
      <section class="card">
        <h2>Checkbox · Variants & States</h2>
        <div class="row">
          <muk-checkbox [(ngModel)]="cb1" variant="primary">Primary</muk-checkbox>
          <muk-checkbox [(ngModel)]="cb2" variant="success">Success</muk-checkbox>
          <muk-checkbox [(ngModel)]="cb3" variant="warning">Warning</muk-checkbox>
          <muk-checkbox [(ngModel)]="cb4" variant="danger">Danger</muk-checkbox>
          <muk-checkbox [(ngModel)]="cb5" variant="info">Info</muk-checkbox>
          <muk-checkbox [(ngModel)]="cb6" [disabled]="true">Disabled</muk-checkbox>
          <muk-checkbox [(ngModel)]="cb7" [indeterminate]="true">Indeterminate</muk-checkbox>
        </div>
        <div class="row" style="margin-top: 12px;">
          <muk-checkbox [(ngModel)]="cbSm" size="sm">Small</muk-checkbox>
          <muk-checkbox [(ngModel)]="cbMd" size="md">Medium</muk-checkbox>
          <muk-checkbox [(ngModel)]="cbLg" size="lg">Large</muk-checkbox>
        </div>
      </section>

      <section class="card">
        <h2>Switch · Variants & Sizes</h2>
        <div class="row">
          <muk-switch [(ngModel)]="sw1" variant="primary">Primary</muk-switch>
          <muk-switch [(ngModel)]="sw2" variant="success">Success</muk-switch>
          <muk-switch [(ngModel)]="sw3" variant="warning">Warning</muk-switch>
          <muk-switch [(ngModel)]="sw4" variant="danger">Danger</muk-switch>
          <muk-switch [(ngModel)]="sw5" variant="info">Info</muk-switch>
          <muk-switch [(ngModel)]="sw6" [disabled]="true">Disabled</muk-switch>
        </div>
        <div class="row" style="margin-top: 12px;">
          <muk-switch [(ngModel)]="swSm" size="sm">Small</muk-switch>
          <muk-switch [(ngModel)]="swMd" size="md">Medium</muk-switch>
          <muk-switch [(ngModel)]="swLg" size="lg">Large</muk-switch>
          <span class="gap"></span>
          <muk-switch [(ngModel)]="swLeft" labelPosition="left">Label on left</muk-switch>
        </div>
      </section>

      <section class="card">
        <h2>Radio Group · Vertical & Horizontal</h2>
        <div class="grid">
          <div>
            <p class="muted">Vertical with descriptions</p>
            <muk-radio-group [(ngModel)]="pickedPlan" [options]="planOptions"></muk-radio-group>
          </div>
          <div>
            <p class="muted">Horizontal · success variant</p>
            <muk-radio-group
              [(ngModel)]="pickedSize"
              [options]="sizeOptions"
              direction="horizontal"
              variant="success"
            ></muk-radio-group>
          </div>
        </div>
      </section>


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
        <div class="row">
          <muk-button size="sm" variant="success" (clicked)="toast.success('Saved successfully!', { title: 'Success' })">Success</muk-button>
          <muk-button size="sm" variant="danger" (clicked)="toast.error('Something went wrong', { title: 'Error' })">Error</muk-button>
          <muk-button size="sm" variant="warning" (clicked)="toast.warning('Please review this', { title: 'Warning' })">Warning</muk-button>
          <muk-button size="sm" variant="info" (clicked)="toast.info('New update available')">Info</muk-button>
          <span class="gap"></span>
          <muk-button size="sm" variant="secondary" buttonStyle="ghost" (clicked)="toast.clear()">Clear All</muk-button>
        </div>
      </section>


      <!-- MODALS -->
      <section class="card">
        <h2>Modals · Positions</h2>
        <div class="row">
          <muk-button size="sm" variant="primary" (clicked)="modalPos = 'center'; modalOpen = true">Center</muk-button>
          <muk-button size="sm" variant="primary" buttonStyle="soft" (clicked)="modalPos = 'top'; modalOpen = true">Top</muk-button>
          <muk-button size="sm" variant="primary" buttonStyle="soft" (clicked)="modalPos = 'bottom'; modalOpen = true">Bottom</muk-button>
          <muk-button size="sm" variant="primary" buttonStyle="soft" (clicked)="modalPos = 'left'; modalOpen = true">Left</muk-button>
          <muk-button size="sm" variant="primary" buttonStyle="soft" (clicked)="modalPos = 'right'; modalOpen = true">Right</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Modals · Features</h2>
        <div class="row">
          <muk-button size="sm" variant="warning" (clicked)="staticOpen = true">Static Backdrop</muk-button>
          <muk-button size="sm" variant="info" (clicked)="scrollOpen = true">Scrollable Content</muk-button>
        </div>
      </section>

      <section class="card">
        <h2>Dialogs · Service (confirm / alert)</h2>
        <div class="row">
          <muk-button size="sm" variant="danger" (clicked)="doConfirmDelete()">Confirm Delete</muk-button>
          <muk-button size="sm" variant="warning" (clicked)="doConfirmLeave()">Confirm Leave</muk-button>
          <muk-button size="sm" variant="success" (clicked)="doAlertSuccess()">Alert Success</muk-button>
          <muk-button size="sm" variant="info" (clicked)="doAlertInfo()">Alert Info</muk-button>
        </div>
        @if (lastResult) {
          <p class="muted" style="margin-top: 12px;">Last result: <strong>{{ lastResult }}</strong></p>
        }
      </section>


      <!-- ALERTS -->
      <section class="card">
        <h2>Alerts · Click to Show</h2>
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
            <muk-alert variant="success" title="Success" [dismissible]="true" (dismissed)="hide('success')">Your changes have been saved successfully!</muk-alert>
          }
          @if (show().warning) {
            <muk-alert variant="warning" title="Warning" [dismissible]="true" (dismissed)="hide('warning')">Your subscription expires in 3 days.</muk-alert>
          }
          @if (show().danger) {
            <muk-alert variant="danger" title="Error" [dismissible]="true" (dismissed)="hide('danger')">Failed to connect to the server.</muk-alert>
          }
          @if (show().info) {
            <muk-alert variant="info" title="Information" [dismissible]="true" (dismissed)="hide('info')">A new version is available.</muk-alert>
          }
          @if (show().primary) {
            <muk-alert variant="primary" title="Notice" [dismissible]="true" (dismissed)="hide('primary')">This is a primary notification.</muk-alert>
          }
          @if (show().secondary) {
            <muk-alert variant="secondary" title="Note" [dismissible]="true" (dismissed)="hide('secondary')">This is a secondary message.</muk-alert>
          }
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
          <muk-input label="Email Address" type="email" placeholder="you@example.com" [formControl]="emailCtrl"></muk-input>
          <muk-input label="Password" type="password" placeholder="At least 8 characters" [formControl]="passwordCtrl"></muk-input>
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

    <!-- Modal instances -->
    <muk-modal [(open)]="modalOpen" [position]="modalPos" size="md">
      <span slot="title">{{ modalPos | titlecase }} Modal</span>
      <p>This modal is positioned at <strong>{{ modalPos }}</strong>.</p>
      <p class="muted">Click outside, press ESC, or use the X to close.</p>
      <div slot="footer">
        <muk-button variant="secondary" buttonStyle="ghost" size="sm" (clicked)="modalOpen = false">Cancel</muk-button>
        <muk-button variant="primary" size="sm" (clicked)="modalOpen = false">OK</muk-button>
      </div>
    </muk-modal>

    <muk-modal [(open)]="staticOpen" position="center" [animation]="'zoom'" [blurBackdrop]="true" size="xl" [staticBackdrop]="true" [closeOnEsc]="false">
      <span slot="title">Static Backdrop</span>
      <p>Clicking outside won't close this. ESC is disabled too. You must use a button.</p>
      <div slot="footer">
        <muk-button variant="primary" size="sm" (clicked)="staticOpen = false">Got it</muk-button>
      </div>
    </muk-modal>

    <muk-modal [(open)]="scrollOpen" position="center" size="md">
      <span slot="title">Scrollable Content</span>
      @for (i of [1,2,3,4,5,6,7,8,9,10,11,12]; track i) {
        <p>Paragraph {{ i }} — long content to demonstrate body scrolling while the header and footer stay fixed.</p>
      }
      <div slot="footer">
        <muk-button variant="primary" size="sm" (clicked)="scrollOpen = false">Close</muk-button>
      </div>
    </muk-modal>

    <muk-toast-container></muk-toast-container>
    <muk-dialog-host></muk-dialog-host>
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
  dialog = inject(DialogService);

  // ── Card state ──
  cardClicks = 0;
  cardLoading = false;
  cardSelected = false;

  onCardClick() {
    this.cardClicks++;
  }

  toggleCardLoading() {
    this.cardLoading = !this.cardLoading;
    if (this.cardLoading) {
      setTimeout(() => this.cardLoading = false, 2500);
    }
  }

  // ── Tabs state ──
  tabValue: 'overview' | 'reports' | 'users' = 'overview';

  // ── Date Picker state ──
  dpBasic: Date | null = null;
  dpStart: Date | null = null;
  dpErr: Date | null = null;
  dpDisabled: Date | null = new Date();
  dpFmt1: Date | null = null;
  dpFmt2: Date | null = null;
  dpFmt3: Date | null = null;
  dpFmt4: Date | null = null;
  dpAppt: Date | null = null;
  dpBiz: Date | null = null;
  dpCustom: Date | null = null;
  dpPast: Date | null = null;
  dpSm: Date | null = null;
  dpMd: Date | null = null;
  dpLg: Date | null = null;
  dpXl: Date | null = null;
  dpTop: Date | null = null;
  dpNone: Date | null = null;

  today = new Date();
  maxAppt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  isUnavailable = (d: Date): boolean => {
    const blocked = [10, 15, 22];
    return blocked.includes(d.getDate());
  };

  // ── Stepper state ──
  checkoutStep = 0;
  vStep = 0;

  // ── Progress state ──
  progValue = 50;
  Math = Math;

  // ── Chip state ──
  activeTags: string[] = ['Angular', 'TypeScript', 'RxJS', 'Material', 'Signals'];
  allTags = ['Angular', 'TypeScript', 'RxJS', 'Material', 'Signals'];

  removeTag(t: string) {
    this.activeTags = this.activeTags.filter(x => x !== t);
  }

  resetTags() {
    this.activeTags = [...this.allTags];
  }

  activeFilter: 'All' | 'Active' | 'Pending' | 'Closed' = 'All';
  filterOptions: Array<'All' | 'Active' | 'Pending' | 'Closed'> = ['All', 'Active', 'Pending', 'Closed'];

  // ── Skeleton state ──
  contentLoading = true;

  // ── Select state ──
  country: string | null = null;
  selectedSkills: string[] = [];
  framework: string | null = null;
  plan = 'pro';

  countries: MukSelectOption[] = [
    { label: 'Sri Lanka', value: 'lk' },
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'India', value: 'in' },
    { label: 'Singapore', value: 'sg' },
    { label: 'Australia', value: 'au' },
  ];

  skills: MukSelectOption[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Node.js', value: 'node' },
    { label: '.NET', value: 'dotnet' },
    { label: 'Python', value: 'py' },
    { label: 'Go', value: 'go' },
  ];

  frameworks: MukSelectOption[] = [
    { label: 'Angular', value: 'ng', group: 'Frontend' },
    { label: 'React', value: 'react', group: 'Frontend' },
    { label: 'Vue', value: 'vue', group: 'Frontend' },
    { label: 'Express', value: 'exp', group: 'Backend' },
    { label: 'NestJS', value: 'nest', group: 'Backend' },
    { label: 'ASP.NET Core', value: 'aspnet', group: 'Backend' },
  ];

  plans: MukSelectOption[] = [
    { label: 'Starter', value: 'starter', description: 'Up to 5 users' },
    { label: 'Pro', value: 'pro', description: 'Up to 50 users · $29/mo' },
    { label: 'Business', value: 'biz', description: 'Unlimited · $99/mo' },
  ];

  // ── Checkbox state ──
  cb1 = true; cb2 = true; cb3 = false; cb4 = false;
  cb5 = true; cb6 = false; cb7 = false;
  cbSm = false; cbMd = true; cbLg = false;

  // ── Switch state ──
  sw1 = true; sw2 = true; sw3 = false; sw4 = false;
  sw5 = true; sw6 = false;
  swSm = false; swMd = true; swLg = true;
  swLeft = true;

  // ── Radio state ──
  pickedPlan = 'pro';
  pickedSize = 'md';

  planOptions: MukRadioOption[] = [
    { label: 'Free', value: 'free', description: '$0 / forever' },
    { label: 'Pro', value: 'pro', description: '$9 / month' },
    { label: 'Enterprise', value: 'ent', description: 'Contact sales', disabled: true },
  ];

  sizeOptions: MukRadioOption[] = [
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ];

  // ── Modal state ──
  modalOpen = false;
  modalPos: 'center' | 'top' | 'bottom' | 'left' | 'right' = 'center';
  staticOpen = false;
  scrollOpen = false;
  lastResult = '';

  async doConfirmDelete() {
    const ok = await this.dialog.confirm({
      title: 'Delete item?',
      message: 'This action cannot be undone.',
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Keep it',
      style: 'solid',
    });
    this.lastResult = ok ? 'Confirmed delete' : 'Cancelled';
  }

  async doConfirmLeave() {
    const ok = await this.dialog.confirm({
      title: 'Unsaved changes',
      message: 'Leave without saving your changes?',
      variant: 'warning',
      confirmText: 'Leave',
    });
    this.lastResult = ok ? 'Left page' : 'Stayed';
  }

  async doAlertSuccess() {
    await this.dialog.alert({
      title: 'Success',
      message: 'Your changes have been saved successfully.',
      variant: 'success',
    });
    this.lastResult = 'Success alert closed';
  }

  async doAlertInfo() {
    await this.dialog.alert({
      title: 'Information',
      message: 'A new version of the app is available.',
      variant: 'info',
      okText: 'Got it',
    });
    this.lastResult = 'Info alert closed';
  }

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
      variant: 'primary',
      position,
      animation,
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