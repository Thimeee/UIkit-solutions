import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ElementRef,
  AfterContentInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

/**
 * Input HTML type. Includes textarea as a pseudo-type.
 */
export type MukInputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'textarea';

/**
 * Input size.
 */
export type MukInputSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Label display style.
 * - floating : label moves up when focused or has value (Material-style)
 * - top      : label always sits above the input (static)
 * - none     : no label (use placeholder only)
 */
export type MukLabelStyle = 'floating' | 'top' | 'none';

/**
 * MUK Input Component - production grade form input.
 *
 * Features:
 *  - Works with ReactiveForms (FormControl) AND template-driven (ngModel)
 *  - Icon agnostic via content projection slots
 *  - Built-in validation message mapping (override-able)
 *  - Password reveal toggle, clearable, character counter
 *  - Floating or static label
 *  - All HTML input types + textarea
 *
 * ── USAGE ──
 *
 * Template-driven (simplest):
 *   <muk-input label="Name" [(ngModel)]="name"></muk-input>
 *
 * Reactive forms:
 *   <muk-input label="Email" [formControl]="emailCtrl"></muk-input>
 *   <muk-input label="Email" formControlName="email"></muk-input>
 *
 * With icons (any library):
 *   <muk-input label="Search" type="search">
 *     <i slot="icon-left" class="fa fa-search"></i>
 *   </muk-input>
 *
 * Prefix / suffix text:
 *   <muk-input label="Price" type="number">
 *     <span slot="prefix">$</span>
 *     <span slot="suffix">USD</span>
 *   </muk-input>
 *
 * Textarea with counter:
 *   <muk-input label="Bio" type="textarea" [maxLength]="200" showCounter></muk-input>
 *
 * Static label:
 *   <muk-input label="Username" labelStyle="top" [(ngModel)]="username"></muk-input>
 */
@Component({
  selector: 'muk-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, AfterContentInit {
  // ── BASIC ──

  /** Visible label text. */
  @Input() label: string = '';

  /** Placeholder text shown when empty. */
  @Input() placeholder: string = '';

  /** Helper text shown below the input. */
  @Input() helperText: string = '';

  /** Input type (HTML5 types + 'textarea'). */
  @Input() type: MukInputType = 'text';

  /** Size variant. */
  @Input() size: MukInputSize = 'md';

  /** Label display style. */
  @Input() labelStyle: MukLabelStyle = 'floating';


  // ── STATES ──

  /** Disabled state. */
  @Input() disabled: boolean = false;

  /** Read-only state. */
  @Input() readonly: boolean = false;

  /** Show required asterisk on label. (Use Validators.required for actual validation.) */
  @Input() required: boolean = false;

  /** Show async-validation loading indicator. */
  @Input() loading: boolean = false;


  // ── INPUT BEHAVIOR ──

  /** HTML autocomplete attribute. */
  @Input() autocomplete: string = 'off';

  /** Auto-focus on mount. */
  @Input() autofocus: boolean = false;


  // ── PASSWORD ──

  /** Show password reveal toggle (only when type=password). Default true. */
  @Input() showPasswordToggle: boolean = true;


  // ── CLEAR ──

  /** Show a clear (X) button when input has a value. */
  @Input() clearable: boolean = false;


  // ── NUMBER ──

  /** Min value (number/date types). */
  @Input() min?: number | string;

  /** Max value (number/date types). */
  @Input() max?: number | string;

  /** Step (number type). */
  @Input() step?: number | string;


  // ── TEXTAREA ──

  /** Textarea rows. */
  @Input() rows: number = 4;

  /** Max length (also enables counter if showCounter is true). */
  @Input() maxLength?: number;

  /** Show character counter (works with maxLength). */
  @Input() showCounter: boolean = false;

  /** Allow vertical resize on textarea. */
  @Input() resizable: boolean = true;


  // ── ERROR DISPLAY ──

  /**
   * Custom error message map. Overrides built-in messages.
   * e.g. { required: 'You must enter a name', email: 'Bad email' }
   */
  @Input() errorMessages: Record<string, string> = {};

  /** Manual error message (overrides validator-based message). */
  @Input() errorMessage?: string;


  // ── EVENTS ──

  @Output() valueChange = new EventEmitter<string | number | null>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();
  @Output() cleared = new EventEmitter<void>();
  @Output() enterPressed = new EventEmitter<KeyboardEvent>();


  // ── INTERNAL ──

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;
  @ViewChild('textareaEl') textareaEl?: ElementRef<HTMLTextAreaElement>;

  /** Internal FormControl used when not wired to a parent form. */
  control = new FormControl<string | number | null>({
    value: '',
    disabled: false,
  });

  showPassword = false;
  hasIconLeft = false;
  hasPrefix = false;
  hasSuffix = false;
  isFocused = false;
  touched = false;

  readonly inputId = `muk-input-${Math.random().toString(36).substring(2, 10)}`;
  readonly errorId = `${this.inputId}-error`;
  readonly helperId = `${this.inputId}-helper`;


  // ── ControlValueAccessor hooks ──

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};


  constructor(
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
  ) {
    // Sync internal control value with parent form
    this.control.valueChanges.subscribe(value => {
      this.onChange(value);
      this.valueChange.emit(value);
    });
  }

  ngAfterContentInit(): void {
    queueMicrotask(() => {
      const el = this.host.nativeElement;
      this.hasIconLeft = !!el.querySelector('[slot="icon-left"]');
      this.hasPrefix = !!el.querySelector('[slot="prefix"]');
      this.hasSuffix = !!el.querySelector('[slot="suffix"]');
      this.cdr.markForCheck();
    });
  }


  // ── ControlValueAccessor ──

  writeValue(value: any): void {
    this.control.setValue(value, { emitEvent: false });
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
    this.cdr.markForCheck();
  }


  // ── COMPUTED ──

  /** Actual HTML type to render (handles password reveal). */
  get actualType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  /** Whether to render <textarea> instead of <input>. */
  get isTextarea(): boolean {
    return this.type === 'textarea';
  }

  /** Whether the field is in error state. */
  get hasError(): boolean {
    if (this.errorMessage) return true;
    return !!(this.control && (this.control.touched || this.touched) && this.control.invalid);
  }

  /** Whether to show password toggle button. */
  get showPasswordButton(): boolean {
    return this.type === 'password' && this.showPasswordToggle;
  }

  /** Whether to show clear button. */
  get showClearButton(): boolean {
    return (
      this.clearable &&
      !this.disabled &&
      !this.readonly &&
      this.control.value !== null &&
      this.control.value !== undefined &&
      this.control.value !== ''
    );
  }

  /** Whether label should appear in "raised" position. */
  get isLabelRaised(): boolean {
    if (this.labelStyle !== 'floating') return false;
    return this.isFocused || !!this.control.value || !!this.placeholder;
  }

  /** Current character count for counter display. */
  get charCount(): number {
    const v = this.control.value;
    return v != null ? String(v).length : 0;
  }

  /** Resolved error message text. */
  get resolvedErrorMessage(): string {
    if (this.errorMessage) return this.errorMessage;
    return this.getErrorMessage(this.control);
  }

  /** Host element classes (applied to <muk-input> tag itself). */
  @HostBinding('class') get hostClass(): string {
    const classes = [
      'muk-input-host',
      `muk-input-size-${this.size}`,
      `muk-input-label-${this.labelStyle}`,
    ];
    if (this.hasError) classes.push('has-error');
    if (this.isFocused) classes.push('is-focused');
    if (this.disabled || this.control.disabled) classes.push('is-disabled');
    if (this.readonly) classes.push('is-readonly');
    if (this.loading) classes.push('is-loading');
    if (this.isTextarea) classes.push('is-textarea');
    if (this.hasIconLeft) classes.push('has-icon-left');
    if (this.hasPrefix) classes.push('has-prefix');
    if (this.hasSuffix) classes.push('has-suffix');
    if (this.showPasswordButton || this.showClearButton) classes.push('has-right-action');
    if (this.isLabelRaised) classes.push('is-label-raised');
    return classes.join(' ');
  }


  // ── EVENT HANDLERS ──

  onFocus(event: FocusEvent): void {
    this.isFocused = true;
    this.focused.emit(event);
    this.cdr.markForCheck();
  }

  onBlur(event: FocusEvent): void {
    this.isFocused = false;
    this.touched = true;
    this.onTouched();
    this.control.markAsTouched();
    this.blurred.emit(event);
    this.cdr.markForCheck();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isTextarea) {
      this.enterPressed.emit(event);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  clearValue(): void {
    this.control.setValue('');
    this.cleared.emit();
    // Refocus the input for better UX
    const el = this.inputEl?.nativeElement || this.textareaEl?.nativeElement;
    el?.focus();
  }


  // ── VALIDATION MESSAGE MAPPING ──

  private getErrorMessage(ctrl: AbstractControl | null): string {
    if (!ctrl?.errors) return '';

    const errors = ctrl.errors;
    const label = this.label || 'This field';
    const overrides = this.errorMessages;

    // Find the first error - check overrides first, then built-ins
    for (const key of Object.keys(errors)) {
      if (overrides[key]) return overrides[key];
    }

    // ── Built-in Angular validators ──
    if (errors['required']) return `${label} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength'])
      return `Must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength'])
      return `Must not exceed ${errors['maxlength'].requiredLength} characters`;
    if (errors['min']) return `Value must be at least ${errors['min'].min}`;
    if (errors['max']) return `Value must not exceed ${errors['max'].max}`;
    if (errors['pattern']) return `Please enter a valid ${label.toLowerCase()}`;
    if (errors['requiredTrue']) return `${label} must be checked`;

    // ── Common custom validators ──
    if (errors['passwordMismatch']) return 'Passwords do not match';
    if (errors['mismatch']) return `${label} does not match`;
    if (errors['whitespace'] || errors['trimmed'])
      return `${label} cannot be only whitespace`;
    if (errors['hasLeadingSpace']) return `${label} cannot start with a space`;
    if (errors['hasTrailingSpace']) return `${label} cannot end with a space`;

    if (errors['invalidNic'] || errors['invalidId'])
      return 'Please enter a valid ID number';
    if (errors['invalidPhone'] || errors['invalidMobile'])
      return 'Please enter a valid phone number';
    if (errors['invalidUrl']) return 'Please enter a valid URL';

    // Date
    if (errors['invalidDate'] || errors['dateInvalid'])
      return 'Please enter a valid date';
    if (errors['minDate'])
      return `Date must be on or after ${errors['minDate'].min}`;
    if (errors['maxDate'])
      return `Date must be on or before ${errors['maxDate'].max}`;
    if (errors['futureDate']) return 'Date cannot be in the future';
    if (errors['pastDate']) return 'Date cannot be in the past';
    if (errors['underage'])
      return `Must be at least ${errors['underage']?.minAge || 18} years old`;

    // Uniqueness
    if (errors['notUnique'] || errors['duplicate'])
      return `${label} already exists`;
    if (errors['usernameTaken']) return 'This username is already taken';
    if (errors['emailTaken']) return 'This email is already registered';

    // Password strength
    if (errors['missingUppercase']) return 'Must contain at least one uppercase letter';
    if (errors['missingLowercase']) return 'Must contain at least one lowercase letter';
    if (errors['missingDigit'] || errors['missingNumber'])
      return 'Must contain at least one number';
    if (errors['missingSpecial']) return 'Must contain at least one special character';
    if (errors['weakPassword']) return 'Password is too weak';

    // Character type
    if (errors['numeric'] || errors['notNumeric'])
      return `${label} must contain only numbers`;
    if (errors['alphabetic'] || errors['notAlphabetic'])
      return `${label} must contain only letters`;
    if (errors['alphanumeric'] || errors['notAlphanumeric'])
      return `${label} must contain only letters and numbers`;
    if (errors['noSpecialChars'])
      return `${label} cannot contain special characters`;

    // Word count
    if (errors['minWords'])
      return `Must contain at least ${errors['minWords'].min} words`;
    if (errors['maxWords'])
      return `Must not exceed ${errors['maxWords'].max} words`;

    // Async / server
    if (errors['serverError'])
      return errors['serverError'].message || 'Server validation failed';
    if (errors['timeout']) return 'Validation timed out, please try again';

    // Fallback
    if (errors['message']) return errors['message'];
    if (errors['customError']) return errors['customError'];

    return 'Invalid value';
  }
}