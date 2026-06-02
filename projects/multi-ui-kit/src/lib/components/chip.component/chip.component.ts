import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukChipVariant =
    | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type MukChipStyle = 'solid' | 'soft' | 'outline';
export type MukChipSize = 'sm' | 'md' | 'lg';
export type MukChipShape = 'rounded' | 'pill' | 'square';

/**
 * MUK Chip / Tag - interactive label with optional remove, icon, avatar.
 *
 * Differs from Badge: chips are INTERACTIVE (clickable, removable, selectable).
 * Use Chip for filters, tags, multi-select pills. Use Badge for static status labels.
 *
 * ── USAGE ──
 *
 * Simple:
 *   <muk-chip>Frontend</muk-chip>
 *   <muk-chip variant="success" chipStyle="soft">Approved</muk-chip>
 *
 * Removable (with X button):
 *   <muk-chip [removable]="true" (removed)="removeTag(t)">{{ t.name }}</muk-chip>
 *
 * Clickable (filter pills):
 *   <muk-chip [clickable]="true" [selected]="filter==='all'" (clicked)="filter='all'">
 *     All
 *   </muk-chip>
 *
 * With icon / avatar:
 *   <muk-chip>
 *     <i slot="icon" class="bi bi-check"></i>
 *     Verified
 *   </muk-chip>
 *
 *   <muk-chip>
 *     <img slot="avatar" src="/u.jpg" />
 *     John Doe
 *   </muk-chip>
 */
@Component({
    selector: 'muk-chip',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <span
      [ngClass]="hostClasses"
      [attr.role]="clickable ? 'button' : null"
      [attr.tabindex]="clickable && !disabled ? 0 : null"
      [attr.aria-disabled]="disabled"
      [attr.aria-pressed]="clickable ? selected : null"
      (click)="onClick($event)"
      (keydown.enter)="onKeyAction($event)"
      (keydown.space)="onKeyAction($event)"
    >
      <span class="muk-chip-avatar">
        <ng-content select="[slot=avatar]"></ng-content>
      </span>
      <span class="muk-chip-icon">
        <ng-content select="[slot=icon]"></ng-content>
      </span>
      <span class="muk-chip-text">
        <ng-content></ng-content>
      </span>
      @if (removable && !disabled) {
        <button
          type="button"
          class="muk-chip-remove"
          (click)="onRemove($event)"
          [attr.aria-label]="'Remove'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      }
    </span>
  `,
    styleUrls: ['./chip.component.scss'],
})
export class ChipComponent {
    @Input() variant: MukChipVariant = 'neutral';
    @Input() chipStyle: MukChipStyle = 'soft';
    @Input() size: MukChipSize = 'md';
    @Input() shape: MukChipShape = 'rounded';

    /** Clickable - makes it act like a button. Emits `clicked`. */
    @Input() clickable = false;

    /** Selected state - filter chips use this. */
    @Input() selected = false;

    /** Show remove (X) button. Emits `removed`. */
    @Input() removable = false;

    /** Disabled. */
    @Input() disabled = false;

    @Output() clicked = new EventEmitter<MouseEvent>();
    @Output() removed = new EventEmitter<void>();

    get hostClasses(): Record<string, boolean> {
        return {
            'muk-chip': true,
            [`muk-chip-${this.variant}`]: true,
            [`muk-chip-style-${this.chipStyle}`]: true,
            [`muk-chip-size-${this.size}`]: true,
            [`muk-chip-shape-${this.shape}`]: true,
            'is-clickable': this.clickable,
            'is-selected': this.selected,
            'is-disabled': this.disabled,
            'is-removable': this.removable,
        };
    }

    onClick(event: MouseEvent): void {
        if (this.disabled || !this.clickable) return;
        this.clicked.emit(event);
    }

    onKeyAction(event: Event): void {
        if (this.disabled || !this.clickable) return;
        event.preventDefault();
        this.clicked.emit(event as unknown as MouseEvent);
    }

    onRemove(event: MouseEvent): void {
        event.stopPropagation();
        if (this.disabled) return;
        this.removed.emit();
    }
}