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

export type MukSwitchVariant =
    | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type MukSwitchSize = 'sm' | 'md' | 'lg';

/**
 * MUK Switch (toggle) - theme-aware, ControlValueAccessor.
 *
 * ── USAGE ──
 *   <muk-switch [(ngModel)]="enabled">Notifications</muk-switch>
 *   <muk-switch [formControl]="ctrl" variant="success" size="lg">Dark mode</muk-switch>
 *   <muk-switch [(ngModel)]="x" labelPosition="left">Wi-Fi</muk-switch>
 */
@Component({
    selector: 'muk-switch',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SwitchComponent),
        multi: true,
    }],
    template: `
    <label
      class="muk-switch"
      [class.is-disabled]="disabled"
      [class.label-left]="labelPosition === 'left'"
      [ngClass]="hostClasses"
    >
      <span class="muk-switch-track">
        <input
          type="checkbox"
          role="switch"
          class="muk-switch-input"
          [checked]="checked"
          [disabled]="disabled"
          [attr.aria-label]="ariaLabel"
          [attr.aria-checked]="checked"
          (change)="onToggle($event)"
          (blur)="onTouched()"
        />
        <span class="muk-switch-thumb"></span>
      </span>
      <span class="muk-switch-label"><ng-content></ng-content></span>
    </label>
  `,
    styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements ControlValueAccessor {
    @Input() variant: MukSwitchVariant = 'primary';
    @Input() size: MukSwitchSize = 'md';
    @Input() disabled = false;
    @Input() labelPosition: 'left' | 'right' = 'right';
    @Input() ariaLabel?: string;

    @Output() checkedChange = new EventEmitter<boolean>();

    checked = false;

    private onChange: (v: boolean) => void = () => { };
    onTouched: () => void = () => { };

    constructor(private cdr: ChangeDetectorRef) { }

    get hostClasses(): Record<string, boolean> {
        return {
            [`muk-switch-${this.variant}`]: true,
            [`muk-switch-size-${this.size}`]: true,
            'is-checked': this.checked,
        };
    }

    onToggle(event: Event): void {
        if (this.disabled) return;
        this.checked = (event.target as HTMLInputElement).checked;
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