import {
    Component,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukProgressVariant =
    | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type MukProgressType = 'linear' | 'circular';
export type MukProgressSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * MUK Progress Bar - linear or circular progress indicator.
 *
 * ── USAGE ──
 *
 * Determinate linear:
 *   <muk-progress [value]="60"></muk-progress>
 *   <muk-progress [value]="80" variant="success" [showLabel]="true"></muk-progress>
 *
 * Striped + animated:
 *   <muk-progress [value]="50" [striped]="true" [animated]="true"></muk-progress>
 *
 * Indeterminate (no value - shows loading animation):
 *   <muk-progress [indeterminate]="true"></muk-progress>
 *
 * Circular:
 *   <muk-progress type="circular" [value]="75"></muk-progress>
 *   <muk-progress type="circular" [indeterminate]="true" size="lg"></muk-progress>
 *
 * With label inside circular:
 *   <muk-progress type="circular" [value]="60" [showLabel]="true"></muk-progress>
 */
@Component({
    selector: 'muk-progress',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    @if (type === 'linear') {
      <div
        class="muk-prog"
        [ngClass]="hostClasses"
        role="progressbar"
        [attr.aria-valuenow]="indeterminate ? null : clampedValue"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="max"
      >
        @if (label) {
          <div class="muk-prog-top">
            <span class="muk-prog-text">{{ label }}</span>
            @if (showLabel) {
              <span class="muk-prog-value">{{ displayValue }}</span>
            }
          </div>
        }
        <div class="muk-prog-track">
          <div
            class="muk-prog-bar"
            [class.is-striped]="striped"
            [class.is-animated]="animated"
            [class.is-indeterminate]="indeterminate"
            [style.width]="indeterminate ? null : clampedValue + '%'"
          >
            @if (showLabel && !label && !indeterminate && size !== 'sm') {
              <span class="muk-prog-inline-label">{{ displayValue }}</span>
            }
          </div>
        </div>
        @if (helperText) {
          <div class="muk-prog-helper">{{ helperText }}</div>
        }
      </div>
    } @else {
      <div
        class="muk-prog-circle"
        [ngClass]="circleClasses"
        role="progressbar"
        [attr.aria-valuenow]="indeterminate ? null : clampedValue"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="max"
      >
        <svg viewBox="0 0 100 100" [class.is-indeterminate]="indeterminate">
          <circle
            class="muk-prog-circle-bg"
            cx="50" cy="50" [attr.r]="radius"
            fill="none"
            [attr.stroke-width]="strokeWidth"
          />
          <circle
            class="muk-prog-circle-fg"
            cx="50" cy="50" [attr.r]="radius"
            fill="none"
            [attr.stroke-width]="strokeWidth"
            stroke-linecap="round"
            [attr.stroke-dasharray]="circumference"
            [attr.stroke-dashoffset]="indeterminate ? null : dashOffset"
          />
        </svg>
        @if (showLabel && !indeterminate) {
          <span class="muk-prog-circle-label">{{ displayValue }}</span>
        }
      </div>
    }
  `,
    styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent {
    @Input() type: MukProgressType = 'linear';
    @Input() variant: MukProgressVariant = 'primary';
    @Input() size: MukProgressSize = 'md';

    /** Current value (0-max). */
    @Input() value = 0;

    /** Max value. Default 100. */
    @Input() max = 100;

    /** Show indeterminate animation (no value). */
    @Input() indeterminate = false;

    /** Show the value (e.g. "60%") label. */
    @Input() showLabel = false;

    /** Top label text (linear only). */
    @Input() label?: string;

    /** Helper text below (linear only). */
    @Input() helperText?: string;

    /** Diagonal stripes (linear only). */
    @Input() striped = false;

    /** Animate the stripes (linear, requires striped=true). */
    @Input() animated = false;


    // ── COMPUTED ──

    get clampedValue(): number {
        return Math.max(0, Math.min(this.max, this.value));
    }

    get percent(): number {
        return (this.clampedValue / this.max) * 100;
    }

    get displayValue(): string {
        return `${Math.round(this.percent)}%`;
    }

    // Circular SVG geometry
    readonly radius = 45;
    get circumference(): number {
        return 2 * Math.PI * this.radius;
    }
    get dashOffset(): number {
        return this.circumference * (1 - this.percent / 100);
    }
    get strokeWidth(): number {
        return this.size === 'sm' ? 8 : this.size === 'lg' ? 10 : this.size === 'xl' ? 11 : 9;
    }


    get hostClasses(): Record<string, boolean> {
        return {
            'muk-prog-linear': true,
            [`muk-prog-${this.variant}`]: true,
            [`muk-prog-size-${this.size}`]: true,
        };
    }

    get circleClasses(): Record<string, boolean> {
        return {
            [`muk-prog-${this.variant}`]: true,
            [`muk-prog-circle-size-${this.size}`]: true,
        };
    }
}