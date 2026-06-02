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

export type MukRadioVariant =
    | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type MukRadioSize = 'sm' | 'md' | 'lg';

/**
 * A single radio option.
 */
export interface MukRadioOption {
    label: string;
    value: any;
    disabled?: boolean;
    /** Optional helper text under the label. */
    description?: string;
}

/**
 * MUK Radio Group - single-select, ControlValueAccessor.
 *
 * ── USAGE ──
 *   <muk-radio-group [(ngModel)]="plan" [options]="planOptions"></muk-radio-group>
 *   <muk-radio-group [formControl]="ctrl" [options]="opts" direction="horizontal"></muk-radio-group>
 *
 *   planOptions = [
 *     { label: 'Free', value: 'free' },
 *     { label: 'Pro', value: 'pro', description: '$9/mo' },
 *     { label: 'Enterprise', value: 'ent', disabled: true },
 *   ];
 */
@Component({
    selector: 'muk-radio-group',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RadioGroupComponent),
        multi: true,
    }],
    template: `
    <div
      class="muk-radio-group"
      role="radiogroup"
      [class.is-horizontal]="direction === 'horizontal'"
      [ngClass]="groupClasses"
    >
      @for (opt of options; track opt.value) {
        <label
          class="muk-radio"
          [class.is-disabled]="opt.disabled || disabled"
          [class.is-selected]="opt.value === selected"
        >
          <span class="muk-radio-circle">
            <input
              type="radio"
              class="muk-radio-input"
              [name]="groupName"
              [value]="opt.value"
              [checked]="opt.value === selected"
              [disabled]="opt.disabled || disabled"
              (change)="onSelect(opt.value)"
              (blur)="onTouched()"
            />
            <span class="muk-radio-dot"></span>
          </span>
          <span class="muk-radio-text">
            <span class="muk-radio-label">{{ opt.label }}</span>
            @if (opt.description) {
              <span class="muk-radio-desc">{{ opt.description }}</span>
            }
          </span>
        </label>
      }
    </div>
  `,
    styleUrls: ['./radio-group.component.scss'],
})
export class RadioGroupComponent implements ControlValueAccessor {
    @Input() options: MukRadioOption[] = [];
    @Input() variant: MukRadioVariant = 'primary';
    @Input() size: MukRadioSize = 'md';
    @Input() direction: 'vertical' | 'horizontal' = 'vertical';
    @Input() disabled = false;

    @Output() valueChange = new EventEmitter<any>();

    selected: any = null;
    readonly groupName = `muk-radio-${Math.random().toString(36).substring(2, 10)}`;

    private onChange: (v: any) => void = () => { };
    onTouched: () => void = () => { };

    constructor(private cdr: ChangeDetectorRef) { }

    get groupClasses(): Record<string, boolean> {
        return {
            [`muk-radio-${this.variant}`]: true,
            [`muk-radio-size-${this.size}`]: true,
        };
    }

    onSelect(value: any): void {
        if (this.disabled) return;
        this.selected = value;
        this.onChange(value);
        this.valueChange.emit(value);
    }

    writeValue(value: any): void {
        this.selected = value;
        this.cdr.markForCheck();
    }
    registerOnChange(fn: (v: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cdr.markForCheck();
    }
}