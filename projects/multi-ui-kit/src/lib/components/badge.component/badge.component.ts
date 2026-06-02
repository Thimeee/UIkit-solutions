import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukBadgeVariant =
  | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';
export type MukBadgeStyle = 'solid' | 'soft' | 'outline';
export type MukBadgeSize = 'sm' | 'md' | 'lg';
export type MukBadgeShape = 'rounded' | 'pill' | 'square';

/**
 * MUK Badge - status pill, count, or label.
 *
 * Two modes:
 *   1. Inline label/count (default)
 *   2. Wrap a target element with [dot] or count overlay (notification badge)
 *
 * ── USAGE ──
 *
 * Simple labels:
 *   <muk-badge variant="success">Active</muk-badge>
 *   <muk-badge variant="danger" badgeStyle="soft">Failed</muk-badge>
 *
 * Notification dot:
 *   <muk-badge dot variant="danger">
 *     <i class="bi bi-bell"></i>
 *   </muk-badge>
 *
 * Count overlay:
 *   <muk-badge [count]="5" variant="danger">
 *     <i class="bi bi-envelope"></i>
 *   </muk-badge>
 *
 *   <muk-badge [count]="99" [max]="9" variant="danger">
 *     <i class="bi bi-bell"></i>
 *   </muk-badge>  <!-- shows "9+" -->
 *
 * Icon + text:
 *   <muk-badge variant="success">
 *     <i slot="icon" class="bi bi-check-circle"></i>
 *     Verified
 *   </muk-badge>
 */
@Component({
  selector: 'muk-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOverlay) {
      <!-- Wrapper mode: notification dot/count over a target -->
      <span class="muk-badge-wrap" [ngClass]="hostClasses">
        <ng-content></ng-content>
        <span class="muk-badge-overlay" [class.is-dot]="dot" [class.is-pulse]="pulse">
          @if (!dot && count !== null && count !== undefined) {
            {{ displayCount }}
          }
        </span>
      </span>
    } @else {
      <!-- Inline label mode -->
      <span class="muk-badge" [ngClass]="hostClasses">
        <span class="muk-badge-icon">
          <ng-content select="[slot=icon]"></ng-content>
        </span>
        <span class="muk-badge-text">
          <ng-content></ng-content>
        </span>
      </span>
    }
  `,
  styleUrls: ['./badge.component.scss'],
})
export class BadgeComponent {
  @Input() variant: MukBadgeVariant = 'primary';
  @Input() badgeStyle: MukBadgeStyle = 'solid';
  @Input() size: MukBadgeSize = 'md';
  @Input() shape: MukBadgeShape = 'rounded';

  /** Show as a notification dot (wraps children). */
  @Input() dot = false;

  /** Show a count overlay (wraps children). */
  @Input() count: number | null = null;

  /** Max count to display - higher shows "{max}+". Default 99. */
  @Input() max = 99;

  /** Hide when count is 0. Default true. */
  @Input() hideZero = true;

  /** Animated pulse on the overlay. */
  @Input() pulse = false;

  /** Whether we're in overlay mode (dot or count). */
  get isOverlay(): boolean {
    return this.dot || this.count !== null;
  }

  get displayCount(): string {
    if (this.count === null || this.count === undefined) return '';
    if (this.hideZero && this.count === 0) return '';
    if (this.count > this.max) return `${this.max}+`;
    return String(this.count);
  }

  get hostClasses(): Record<string, boolean> {
    return {
      [`muk-badge-${this.variant}`]: true,
      [`muk-badge-style-${this.badgeStyle}`]: !this.isOverlay,
      [`muk-badge-size-${this.size}`]: !this.isOverlay,
      [`muk-badge-shape-${this.shape}`]: !this.isOverlay,
      'is-empty-count': this.isOverlay && !this.dot && !this.displayCount,
    };
  }
}