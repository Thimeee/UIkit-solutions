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

export type MukButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'light'
  | 'dark';

/**
 * - solid    : filled colored button (default, primary CTAs)
 * - soft     : light tinted background, colored text (subtle)
 * - outline  : transparent with border
 * - ghost    : text only, hover bg
 */
export type MukButtonStyle = 'solid' | 'soft' | 'outline' | 'ghost';
export type MukButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type MukButtonShape = 'rounded' | 'square' | 'pill' | 'circle';
export type MukButtonType = 'button' | 'submit' | 'reset';

/**
 * MUK Button - icon library agnostic.
 *
 * Icons via slot attribute:
 *   <muk-button>
 *     <i slot="icon-left" class="..."></i>
 *     Save
 *   </muk-button>
 *
 * Icon only:
 *   <muk-button iconOnly ariaLabel="Delete">
 *     <i class="..."></i>
 *   </muk-button>
 */
@Component({
  selector: 'muk-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent implements AfterContentInit {
  // ── APPEARANCE ──
  @Input() variant: MukButtonVariant = 'primary';
  @Input() buttonStyle: MukButtonStyle = 'solid';
  @Input() size: MukButtonSize = 'md';
  @Input() shape: MukButtonShape = 'rounded';

  // ── STATES ──
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() active: boolean = false;

  // ── LAYOUT ──
  @Input() block: boolean = false;
  @Input() iconOnly: boolean = false;

  // ── STYLE OPTIONS ──
  @Input() gradient: boolean = true;
  @Input() hoverLift: boolean = true;
  @Input() shadow: boolean = true;

  // ── NATIVE BUTTON ──
  @Input() type: MukButtonType = 'button';
  @Input() loadingText?: string;
  @Input() ariaLabel?: string;

  // ── EVENTS ──
  @Output() clicked = new EventEmitter<MouseEvent>();

  // ── SLOT FILL DETECTION ──
  // Angular <ng-content> doesn't expose "is this slot filled".
  // We query the host DOM after content init to set flags,
  // which then conditionally render wrapper spans in the template.

  hasIconLeft = false;
  hasIconRight = false;

  constructor(
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterContentInit(): void {
    // Run after Angular projects content, then check what landed.
    queueMicrotask(() => {
      const el = this.host.nativeElement;
      this.hasIconLeft = !!el.querySelector('[slot="icon-left"]');
      this.hasIconRight = !!el.querySelector('[slot="icon-right"]');
      this.cdr.markForCheck();
    });
  }

  get hostClasses(): Record<string, boolean> {
    return {
      'muk-btn': true,
      [`muk-btn-${this.buttonStyle}`]: true,
      [`muk-btn-${this.variant}`]: true,
      [`muk-btn-size-${this.size}`]: true,
      [`muk-btn-shape-${this.shape}`]: true,
      'is-disabled': this.disabled || this.loading,
      'is-loading': this.loading,
      'is-active': this.active,
      'is-block': this.block,
      'is-icon-only': this.iconOnly,
      'has-gradient': this.gradient && this.buttonStyle === 'solid',
      'has-hover-lift': this.hoverLift && !this.disabled && !this.loading,
      'has-shadow': this.shadow && this.buttonStyle === 'solid',
    };
  }

  handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
