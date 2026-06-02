import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    AfterContentInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukCardVariant =
    | 'default' | 'bordered' | 'elevated' | 'filled' | 'ghost';
export type MukCardSize = 'sm' | 'md' | 'lg' | 'xl';
export type MukCardRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type MukCardHoverEffect = 'none' | 'lift' | 'glow' | 'zoom' | 'border';
export type MukCardOrientation = 'vertical' | 'horizontal';

/**
 * MUK Card - configurable content container.
 *
 * Two ways to use:
 *
 * 1. SIMPLE - just wrap content:
 *      <muk-card>
 *        <h3>Title</h3>
 *        <p>Content</p>
 *      </muk-card>
 *
 * 2. STRUCTURED - use slots:
 *      <muk-card variant="elevated" hoverEffect="lift">
 *        <div slot="header">
 *          <h3>Profile</h3>
 *        </div>
 *        <div slot="media">
 *          <img src="..." />
 *        </div>
 *        Body content here...
 *        <div slot="footer">
 *          <muk-button>Action</muk-button>
 *        </div>
 *      </muk-card>
 *
 * 3. CLICKABLE:
 *      <muk-card [clickable]="true" (clicked)="onCardClick()">...</muk-card>
 *
 * 4. DISABLED:
 *      <muk-card [disabled]="true">...</muk-card>
 *
 * 5. HORIZONTAL (media on left):
 *      <muk-card orientation="horizontal">
 *        <div slot="media"><img /></div>
 *        Body...
 *      </muk-card>
 */
@Component({
    selector: 'muk-card',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div
      [ngClass]="hostClasses"
      [attr.role]="clickable ? 'button' : null"
      [attr.tabindex]="clickable && !disabled ? 0 : null"
      [attr.aria-disabled]="disabled"
      (click)="onClick($event)"
      (keydown.enter)="onKeyAction($event)"
      (keydown.space)="onKeyAction($event)"
    >
      <!-- Media (top in vertical, left in horizontal) -->
      <div class="muk-card-media" [class.is-hidden]="!hasMedia">
        <ng-content select="[slot=media]"></ng-content>
      </div>

      <!-- Main column -->
      <div class="muk-card-main">
        <!-- Header -->
        <div class="muk-card-header" [class.is-hidden]="!hasHeader && !title">
          @if (title) {
            <div class="muk-card-title">{{ title }}</div>
            @if (subtitle) {
              <div class="muk-card-subtitle">{{ subtitle }}</div>
            }
          } @else {
            <ng-content select="[slot=header]"></ng-content>
          }
        </div>

        <!-- Body -->
        <div class="muk-card-body">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        <div class="muk-card-footer" [class.is-hidden]="!hasFooter">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      </div>

      <!-- Loading overlay -->
      @if (loading) {
        <div class="muk-card-loading">
          <span class="muk-card-spinner"></span>
        </div>
      }
    </div>
  `,
    styleUrls: ['./card.component.scss'],
})
export class CardComponent implements AfterContentInit {
    // ── APPEARANCE ──

    @Input() variant: MukCardVariant = 'default';
    @Input() size: MukCardSize = 'md';
    @Input() radius: MukCardRadius = 'md';
    @Input() orientation: MukCardOrientation = 'vertical';

    /** Hover effect - 'lift' is the most common. */
    @Input() hoverEffect: MukCardHoverEffect = 'none';

    /** Optional simple title (alternative to [slot=header]). */
    @Input() title?: string;

    /** Optional subtitle (used with `title`). */
    @Input() subtitle?: string;


    // ── BEHAVIOR ──

    /** Makes the entire card a clickable button (emits `clicked`). */
    @Input() clickable = false;

    /** Disabled state - dims the card, blocks clicks. */
    @Input() disabled = false;

    /** Show a loading overlay with spinner. */
    @Input() loading = false;

    /** Selected/active state - colored border + subtle highlight. */
    @Input() selected = false;

    /** Show drop shadow. Default true for `elevated`, false otherwise. */
    @Input() shadow?: boolean;


    // ── EVENTS ──

    @Output() clicked = new EventEmitter<MouseEvent>();


    // ── STATE ──

    hasMedia = false;
    hasHeader = false;
    hasFooter = false;

    constructor(
        private host: ElementRef<HTMLElement>,
        private cdr: ChangeDetectorRef,
    ) { }

    ngAfterContentInit(): void {
        queueMicrotask(() => {
            const el = this.host.nativeElement;
            this.hasMedia = !!el.querySelector('[slot="media"]');
            this.hasHeader = !!el.querySelector('[slot="header"]');
            this.hasFooter = !!el.querySelector('[slot="footer"]');
            this.cdr.markForCheck();
        });
    }


    // ── COMPUTED ──

    get hostClasses(): Record<string, boolean> {
        const showShadow = this.shadow ?? (this.variant === 'elevated');
        return {
            'muk-card': true,
            [`muk-card-variant-${this.variant}`]: true,
            [`muk-card-size-${this.size}`]: true,
            [`muk-card-radius-${this.radius}`]: true,
            [`muk-card-orient-${this.orientation}`]: true,
            [`muk-card-hover-${this.hoverEffect}`]: this.hoverEffect !== 'none' && !this.disabled,
            'is-clickable': this.clickable,
            'is-disabled': this.disabled,
            'is-loading': this.loading,
            'is-selected': this.selected,
            'has-shadow': showShadow,
        };
    }


    // ── ACTIONS ──

    onClick(event: MouseEvent): void {
        if (this.disabled || this.loading || !this.clickable) return;
        this.clicked.emit(event);
    }

    onKeyAction(event: Event): void {
        if (this.disabled || this.loading || !this.clickable) return;
        event.preventDefault();
        this.clicked.emit(event as unknown as MouseEvent);
    }
}