import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ChangeDetectionStrategy,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukAccordionVariant = 'default' | 'bordered' | 'filled' | 'separated';
export type MukAccordionSize = 'sm' | 'md' | 'lg';

/**
 * A single accordion section.
 *
 * Usage inside <muk-accordion>:
 *   <muk-accordion-item title="Section title">
 *     ...body content...
 *   </muk-accordion-item>
 *
 * Or use a custom header via [slot=header]:
 *   <muk-accordion-item>
 *     <div slot="header">
 *       <i class="bi bi-gear"></i> Settings
 *     </div>
 *     ...body...
 *   </muk-accordion-item>
 */
@Component({
  selector: 'muk-accordion-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="muk-acc-item" [class.is-open]="open()" [class.is-disabled]="disabled">
      <button
        type="button"
        class="muk-acc-header"
        [attr.aria-expanded]="open()"
        [attr.aria-disabled]="disabled"
        [disabled]="disabled"
        (click)="toggle()"
      >
        @if (icon) {
          <i class="muk-acc-leading-icon" [class]="icon"></i>
        }
        <span class="muk-acc-title">
          @if (title) {
            {{ title }}
          } @else {
            <ng-content select="[slot=header]"></ng-content>
          }
        </span>
        <span class="muk-acc-chevron" [class.is-open]="open()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>

      <div class="muk-acc-body-wrap" [style.maxHeight]="open() ? '2000px' : '0'">
        <div class="muk-acc-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./accordion.component.scss'], // styled by parent <muk-accordion> SCSS to avoid duplication
})
export class AccordionItemComponent {
  /** Header title (string). Or use [slot=header] for custom content. */
  @Input() title?: string;

  /** Optional leading icon class (e.g. 'bi bi-gear'). */
  @Input() icon?: string;

  /** Disabled - cannot toggle. */
  @Input() disabled = false;

  /** Whether this item starts open. Default false. */
  @Input() set defaultOpen(v: boolean) {
    if (v) this.open.set(true);
  }

  /** Emitted whenever open state changes. */
  @Output() openChange = new EventEmitter<boolean>();

  /** Reactive open state. */
  readonly open = signal(false);

  toggle(): void {
    if (this.disabled) return;
    this.open.set(!this.open());
    this.openChange.emit(this.open());
  }

  setOpen(value: boolean): void {
    if (this.disabled) return;
    if (this.open() === value) return;
    this.open.set(value);
    this.openChange.emit(value);
  }
}


/**
 * MUK Accordion - collapsible sections.
 *
 * ── USAGE ──
 *
 *   <muk-accordion>
 *     <muk-accordion-item title="What is MUK?">
 *       MUK is a component library...
 *     </muk-accordion-item>
 *     <muk-accordion-item title="How to install?">
 *       npm install multi-ui-kit
 *     </muk-accordion-item>
 *   </muk-accordion>
 *
 * Single-open (only one item open at a time):
 *   <muk-accordion [multiple]="false">...</muk-accordion>
 *
 * With variants & sizes:
 *   <muk-accordion variant="bordered" size="lg">...</muk-accordion>
 */
@Component({
  selector: 'muk-accordion',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="muk-accordion" [ngClass]="hostClasses">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements AfterContentInit {
  /** Allow multiple sections open at once. Default true. */
  @Input() multiple = true;

  /** Visual style. */
  @Input() variant: MukAccordionVariant = 'default';

  /** Size. */
  @Input() size: MukAccordionSize = 'md';

  /** Use chevron animation. Default true. */
  @Input() animated = true;

  @ContentChildren(AccordionItemComponent) items!: QueryList<AccordionItemComponent>;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterContentInit(): void {
    if (!this.multiple) {
      // Subscribe to each item's openChange and close siblings when one opens
      this.items.forEach(item => {
        item.openChange.subscribe(opened => {
          if (opened) {
            this.items.forEach(other => {
              if (other !== item && other.open()) {
                other.setOpen(false);
              }
            });
          }
        });
      });
    }
  }

  /** Open all items (multiple mode only). */
  openAll(): void {
    if (!this.multiple) return;
    this.items?.forEach(item => item.setOpen(true));
  }

  /** Close all items. */
  closeAll(): void {
    this.items?.forEach(item => item.setOpen(false));
  }

  get hostClasses(): Record<string, boolean> {
    return {
      [`muk-acc-variant-${this.variant}`]: true,
      [`muk-acc-size-${this.size}`]: true,
      'is-animated': this.animated,
    };
  }
}