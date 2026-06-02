import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
    HostListener,
    forwardRef,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export type MukSelectSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * A single option in the dropdown.
 */
export interface MukSelectOption {
    /** Display label. */
    label: string;
    /** Underlying value (any). */
    value: any;
    /** Disable this option. */
    disabled?: boolean;
    /** Optional secondary text below the label. */
    description?: string;
    /** Optional group name - options with the same group are grouped. */
    group?: string;
}

/**
 * MUK Select / Dropdown - single or multiple, searchable, ControlValueAccessor.
 *
 * ── USAGE ──
 *
 * Single select:
 *   <muk-select
 *     label="Country"
 *     [options]="countries"
 *     [(ngModel)]="selectedCountry"
 *   ></muk-select>
 *
 * Multi-select with search:
 *   <muk-select
 *     label="Tags"
 *     [options]="tags"
 *     [multiple]="true"
 *     [searchable]="true"
 *     [(ngModel)]="selectedTags"
 *   ></muk-select>
 *
 * With Reactive Form:
 *   <muk-select [formControl]="ctrl" [options]="opts"></muk-select>
 */
@Component({
    selector: 'muk-select',
    standalone: true,
    imports: [CommonModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectComponent),
        multi: true,
    }],
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements ControlValueAccessor {
    @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

    // ── DATA ──

    /** All available options. */
    @Input() options: MukSelectOption[] = [];

    /** Multi-select mode (value becomes an array). Default false. */
    @Input() multiple = false;


    // ── APPEARANCE ──

    /** Label above the field. */
    @Input() label?: string;

    /** Placeholder shown when nothing is selected. */
    @Input() placeholder = 'Select...';

    /** Helper text shown below. */
    @Input() helperText?: string;

    /** Size. Default 'md'. */
    @Input() size: MukSelectSize = 'md';


    // ── BEHAVIOR ──

    /** Show search input inside the dropdown. Default false. */
    @Input() searchable = false;

    /** Show an X button to clear selection. Default true. */
    @Input() clearable = true;

    /** Disabled. */
    @Input() disabled = false;

    /** Required - shows red asterisk in label. */
    @Input() required = false;

    /** Close dropdown after selection (single only). Default true. */
    @Input() closeOnSelect = true;

    /** Max chips to show in multi-select trigger before "+N more". Default 3. */
    @Input() maxChips = 3;

    /** Error message override. */
    @Input() errorMessage?: string;

    /** Search placeholder text. */
    @Input() searchPlaceholder = 'Search...';

    /** Empty-state text when search yields nothing. */
    @Input() noResultsText = 'No results found';


    // ── EVENTS ──

    /** Emits the new value(s). */
    @Output() selectionChange = new EventEmitter<any>();

    /** Emitted when dropdown opens. */
    @Output() opened = new EventEmitter<void>();

    /** Emitted when dropdown closes. */
    @Output() closed = new EventEmitter<void>();


    // ── STATE ──

    isOpen = false;
    searchTerm = '';
    highlightedIndex = -1;

    /** The currently selected value(s). single: any, multi: any[] */
    private _value: any = null;

    // ControlValueAccessor
    private onChange: (v: any) => void = () => { };
    onTouched: () => void = () => { };


    constructor(
        private host: ElementRef<HTMLElement>,
        private cdr: ChangeDetectorRef,
    ) { }


    // ── COMPUTED ──

    /** Selected values as an array (always - simplifies logic). */
    get selectedValues(): any[] {
        if (this._value == null) return [];
        if (this.multiple) return Array.isArray(this._value) ? this._value : [];
        return [this._value];
    }

    /** Options filtered by search term. */
    get filteredOptions(): MukSelectOption[] {
        if (!this.searchTerm) return this.options;
        const q = this.searchTerm.toLowerCase();
        return this.options.filter(o =>
            o.label.toLowerCase().includes(q) ||
            (o.description?.toLowerCase().includes(q) ?? false)
        );
    }

    /** Options grouped by their `group` field. */
    get groupedOptions(): { group: string; options: MukSelectOption[] }[] {
        const filtered = this.filteredOptions;
        const groups = new Map<string, MukSelectOption[]>();
        for (const opt of filtered) {
            const g = opt.group ?? '';
            if (!groups.has(g)) groups.set(g, []);
            groups.get(g)!.push(opt);
        }
        return Array.from(groups.entries()).map(([group, options]) => ({ group, options }));
    }

    /** Whether any options have group set. */
    get hasGroups(): boolean {
        return this.options.some(o => !!o.group);
    }

    /** Selected option objects (looked up from values). */
    get selectedOptions(): MukSelectOption[] {
        return this.options.filter(o => this.selectedValues.some(v => this.equals(v, o.value)));
    }

    /** Whether anything is selected. */
    get hasValue(): boolean {
        return this.selectedValues.length > 0;
    }

    /** Chips to display in trigger (multi-select). */
    get displayChips(): MukSelectOption[] {
        return this.selectedOptions.slice(0, this.maxChips);
    }

    /** Number hidden behind "+N more". */
    get extraCount(): number {
        return Math.max(0, this.selectedOptions.length - this.maxChips);
    }

    /** Single-select displayed label. */
    get singleLabel(): string {
        return this.selectedOptions[0]?.label ?? '';
    }

    get hasError(): boolean {
        return !!this.errorMessage;
    }

    get hostClasses(): Record<string, boolean> {
        return {
            [`muk-select-size-${this.size}`]: true,
            'is-open': this.isOpen,
            'is-disabled': this.disabled,
            'has-error': this.hasError,
            'has-value': this.hasValue,
            'is-multiple': this.multiple,
        };
    }


    // ── ACTIONS ──

    isSelected(option: MukSelectOption): boolean {
        return this.selectedValues.some(v => this.equals(v, option.value));
    }

    selectOption(option: MukSelectOption): void {
        if (option.disabled) return;

        if (this.multiple) {
            const current = [...this.selectedValues];
            const idx = current.findIndex(v => this.equals(v, option.value));
            if (idx >= 0) {
                current.splice(idx, 1);
            } else {
                current.push(option.value);
            }
            this._value = current;
            this.emitChange();
            // Multi-select stays open
        } else {
            this._value = option.value;
            this.emitChange();
            if (this.closeOnSelect) this.closeDropdown();
        }
    }

    /** Remove a single chip in multi-select. */
    removeChip(option: MukSelectOption, event: Event): void {
        event.stopPropagation();
        if (this.disabled) return;
        const current = this.selectedValues.filter(v => !this.equals(v, option.value));
        this._value = current;
        this.emitChange();
    }

    /** Clear all selection. */
    clear(event?: Event): void {
        event?.stopPropagation();
        if (this.disabled) return;
        this._value = this.multiple ? [] : null;
        this.emitChange();
    }

    toggleDropdown(): void {
        if (this.disabled) return;
        this.isOpen ? this.closeDropdown() : this.openDropdown();
    }

    openDropdown(): void {
        if (this.disabled || this.isOpen) return;
        this.isOpen = true;
        this.highlightedIndex = -1;
        this.opened.emit();
        this.cdr.markForCheck();
        // Focus search if available
        if (this.searchable) {
            setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
        }
    }

    closeDropdown(): void {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.searchTerm = '';
        this.highlightedIndex = -1;
        this.onTouched();
        this.closed.emit();
        this.cdr.markForCheck();
    }

    onSearchChange(value: string): void {
        this.searchTerm = value;
        this.highlightedIndex = -1;
        this.cdr.markForCheck();
    }


    // ── KEYBOARD ──

    onKeydown(event: KeyboardEvent): void {
        if (this.disabled) return;

        if (!this.isOpen) {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
                event.preventDefault();
                this.openDropdown();
            }
            return;
        }

        const opts = this.filteredOptions;
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.highlightedIndex = Math.min(this.highlightedIndex + 1, opts.length - 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
                break;
            case 'Enter':
                event.preventDefault();
                if (this.highlightedIndex >= 0 && opts[this.highlightedIndex]) {
                    this.selectOption(opts[this.highlightedIndex]);
                }
                break;
            case 'Escape':
                event.preventDefault();
                this.closeDropdown();
                break;
        }
        this.cdr.markForCheck();
    }


    // ── OUTSIDE CLICK ──

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        if (!this.isOpen) return;
        const target = event.target as Node;
        if (!this.host.nativeElement.contains(target)) {
            this.closeDropdown();
        }
    }


    // ── INTERNAL ──

    private emitChange(): void {
        const value = this.multiple ? this.selectedValues : this._value;
        this.onChange(value);
        this.selectionChange.emit(value);
        this.cdr.markForCheck();
    }

    private equals(a: any, b: any): boolean {
        if (a === b) return true;
        // Shallow object equality for object-valued options
        if (typeof a === 'object' && typeof b === 'object' && a && b) {
            return JSON.stringify(a) === JSON.stringify(b);
        }
        return false;
    }


    // ── CONTROL VALUE ACCESSOR ──

    writeValue(value: any): void {
        if (this.multiple) {
            this._value = Array.isArray(value) ? value : (value == null ? [] : [value]);
        } else {
            this._value = value ?? null;
        }
        this.cdr.markForCheck();
    }
    registerOnChange(fn: (v: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (isDisabled) this.closeDropdown();
        this.cdr.markForCheck();
    }
}