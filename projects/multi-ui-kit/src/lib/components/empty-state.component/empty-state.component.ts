import {
    Component,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukEmptyStateSize = 'sm' | 'md' | 'lg';
export type MukEmptyStateVariant = 'default' | 'bordered' | 'subtle';

/**
 * MUK Empty State - placeholder when there's no data to show.
 *
 * Use for: "No transactions yet", "Inbox is empty", "No search results",
 * "404 not found", error pages.
 *
 * ── USAGE ──
 *
 * Basic:
 *   <muk-empty-state
 *     icon="bi bi-inbox"
 *     title="No messages yet"
 *     description="When you receive messages, they'll show up here."
 *   ></muk-empty-state>
 *
 * With actions:
 *   <muk-empty-state title="No customers" icon="bi bi-people">
 *     Start by adding your first customer.
 *     <div slot="actions">
 *       <muk-button variant="primary">Add Customer</muk-button>
 *       <muk-button buttonStyle="ghost">Import CSV</muk-button>
 *     </div>
 *   </muk-empty-state>
 *
 * Custom icon (any element):
 *   <muk-empty-state title="Search">
 *     <img slot="icon" src="/search.svg" />
 *   </muk-empty-state>
 *
 * Compact (inline in cards/tables):
 *   <muk-empty-state size="sm" icon="bi bi-search" title="No results"></muk-empty-state>
 */
@Component({
    selector: 'muk-empty-state',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [ngClass]="hostClasses" role="status">
      <div class="muk-empty-icon">
        @if (icon) {
          <i [class]="icon"></i>
        } @else {
          <ng-content select="[slot=icon]"></ng-content>
        }
        @if (!icon && !hasIconSlot) {
          <!-- Default illustration -->
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="10" y="14" width="44" height="36" rx="4"/>
            <line x1="10" y1="26" x2="54" y2="26"/>
            <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
            <circle cx="24" cy="20" r="1.5" fill="currentColor"/>
          </svg>
        }
      </div>

      <div class="muk-empty-body">
        @if (title) {
          <h3 class="muk-empty-title">{{ title }}</h3>
        } @else {
          <ng-content select="[slot=title]"></ng-content>
        }

        <div class="muk-empty-desc">
          @if (description) {
            <p>{{ description }}</p>
          } @else {
            <ng-content></ng-content>
          }
        </div>

        <div class="muk-empty-actions" [class.is-hidden]="!hasActionsSlot">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
    @Input() icon?: string;
    @Input() title?: string;
    @Input() description?: string;
    @Input() size: MukEmptyStateSize = 'md';
    @Input() variant: MukEmptyStateVariant = 'default';

    /** Center vs left-align text. Default center. */
    @Input() align: 'center' | 'left' = 'center';

    get hasIconSlot(): boolean { return false; }   // detected via CSS :empty
    get hasActionsSlot(): boolean { return true; } // toggled via CSS :empty

    get hostClasses(): Record<string, boolean> {
        return {
            'muk-empty': true,
            [`muk-empty-size-${this.size}`]: true,
            [`muk-empty-variant-${this.variant}`]: true,
            [`muk-empty-align-${this.align}`]: true,
        };
    }
}