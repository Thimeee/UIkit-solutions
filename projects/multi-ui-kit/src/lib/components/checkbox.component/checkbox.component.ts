import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export type MukCheckboxVariant =
    | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type MukCheckboxSize = 'sm' | 'md' | 'lg';

/**
 * MUK Checkbox - theme-aware, ControlValueAccessor.
 *
 * ── USAGE ──
 *   <muk-checkbox [(ngModel)]="agreed">I agree</muk-checkbox>
 *   <muk-checkbox [formControl]="ctrl" variant="success">Subscribe</muk-checkbox>
 *   <muk-checkbox [(ngModel)]="x" [indeterminate]="someChecked">Select all</muk-checkbox>
 */
@Component({
    selector: 'muk-checkbox',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CheckboxComponent),
        multi: true,
    }],
    template: `
    <label class="muk-check" [class.is-disabled]="disabled" [ngClass]="hostClasses">
      <span class="muk-check-box">
        <input
          type="checkbox"
          class="muk-check-input"
          [checked]="checked"
          [disabled]="disabled"
          [indeterminate]="indeterminate"
          [attr.aria-label]="ariaLabel"
          (change)="onToggle($event)"
          (blur)="onTouched()"
        />
        <span class="muk-check-mark">
          @if (indeterminate) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
              <line x1="6" y1="12" x2="18" y2="12"></line>
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          }
        </span>
      </span>
      <span class="muk-check-label"><ng-content></ng-content></span>
    </label>
  `,
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() variant: MukCheckboxVariant = 'primary';
    @Input() size: MukCheckboxSize = 'md';
    @Input() disabled = false;
    @Input() indeterminate = false;
    @Input() ariaLabel?: string;

    @Output() checkedChange = new EventEmitter<boolean>();

    checked = false;

    private onChange: (v: boolean) => void = () => { };
    onTouched: () => void = () => { };

    constructor(private cdr: ChangeDetectorRef) { }

    get hostClasses(): Record<string, boolean> {
        return {
            [`muk-check-${this.variant}`]: true,
            [`muk-check-size-${this.size}`]: true,
            'is-checked': this.checked,
            'is-indeterminate': this.indeterminate,
        };
    }

    onToggle(event: Event): void {
        if (this.disabled) return;
        this.checked = (event.target as HTMLInputElement).checked;
        this.indeterminate = false;
        this.onChange(this.checked);
        this.checkedChange.emit(this.checked);
    }

    writeValue(value: boolean): void {
        this.checked = !!value;
        this.cdr.markForCheck();
    }
    registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cdr.markForCheck();
    }
}