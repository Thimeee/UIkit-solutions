import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    signal,
    computed,
    forwardRef,
    ElementRef,
    HostListener,
    inject,
    ViewChild,
    AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type MukDatePickerSize = 'sm' | 'md' | 'lg' | 'xl';
export type MukDatePickerView = 'days' | 'months' | 'years';

export interface MukDatePickerLocale {
    months: string[];
    monthsShort: string[];
    weekdays: string[];     // Sun..Sat
    weekdaysShort: string[];
    today: string;
    clear: string;
    cancel: string;
    apply: string;
}

export const MUK_DEFAULT_LOCALE: MukDatePickerLocale = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    today: 'Today',
    clear: 'Clear',
    cancel: 'Cancel',
    apply: 'Apply',
};

/**
 * MUK Date Picker - calendar dropdown date input.
 *
 * ── USAGE ──
 *
 * Basic (ngModel):
 *   <muk-date-picker label="Date of birth" [(ngModel)]="dob"></muk-date-picker>
 *
 * Reactive form:
 *   <muk-date-picker label="Start date" [formControl]="startCtrl"></muk-date-picker>
 *
 * With constraints:
 *   <muk-date-picker
 *     label="Appointment"
 *     [min]="minDate"
 *     [max]="maxDate"
 *     [(ngModel)]="date"
 *   ></muk-date-picker>
 *
 * Custom format:
 *   <muk-date-picker format="dd/MM/yyyy"></muk-date-picker>     (default)
 *   <muk-date-picker format="yyyy-MM-dd"></muk-date-picker>
 *   <muk-date-picker format="MMM d, yyyy"></muk-date-picker>
 *
 * Disable specific days:
 *   <muk-date-picker [disabledDays]="[0, 6]"></muk-date-picker>   (Sun + Sat)
 *
 * Custom disabled predicate:
 *   <muk-date-picker [disabledDateFn]="isHoliday"></muk-date-picker>
 *
 * Week start (0=Sun, 1=Mon):
 *   <muk-date-picker [weekStartsOn]="1"></muk-date-picker>
 */
@Component({
    selector: 'muk-date-picker',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true,
        },
    ],
    template: `
    <div class="muk-dp" [ngClass]="hostClasses">
      <!-- INPUT TRIGGER -->
      @if (label && labelStyle === 'top') {
        <label class="muk-dp-label-top" (click)="open()">{{ label }}</label>
      }

      <div
        class="muk-dp-input"
        [class.is-open]="isOpen()"
        [class.is-disabled]="disabled"
        [class.has-value]="!!selectedDate()"
        [class.has-error]="!!errorMessage"
        (click)="toggle($event)"
      >
        <span class="muk-dp-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </span>

        <span class="muk-dp-value">
          @if (selectedDate()) {
            {{ displayValue() }}
          } @else {
            <span class="muk-dp-placeholder">{{ placeholder }}</span>
          }
        </span>

        @if (label && labelStyle === 'floating') {
          <span class="muk-dp-label-float" [class.is-floating]="!!selectedDate() || isOpen()">
            {{ label }}
          </span>
        }

        @if (clearable && selectedDate() && !disabled) {
          <button
            type="button"
            class="muk-dp-clear"
            (click)="onClear($event)"
            aria-label="Clear date"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        }

        <span class="muk-dp-caret" [class.is-open]="isOpen()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>

      @if (helperText && !errorMessage) {
        <div class="muk-dp-helper">{{ helperText }}</div>
      }
      @if (errorMessage) {
        <div class="muk-dp-error">{{ errorMessage }}</div>
      }


      <!-- CALENDAR POPUP -->
      @if (isOpen()) {
        <div class="muk-dp-popup" #popup>
          <!-- HEADER -->
          <div class="muk-dp-pop-header">
            <button type="button" class="muk-dp-nav" (click)="prev()" [attr.aria-label]="'Previous'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <button type="button" class="muk-dp-title" (click)="toggleView()">
              @if (currentView() === 'days') {
                {{ locale.months[viewMonth()] }} {{ viewYear() }}
              } @else if (currentView() === 'months') {
                {{ viewYear() }}
              } @else {
                {{ yearRangeLabel() }}
              }
            </button>

            <button type="button" class="muk-dp-nav" (click)="next()" [attr.aria-label]="'Next'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>

          <!-- BODY -->
          <div class="muk-dp-pop-body">
            <!-- DAY VIEW -->
            @if (currentView() === 'days') {
              <div class="muk-dp-weekdays">
                @for (wd of weekdayLabels(); track wd) {
                  <span class="muk-dp-weekday">{{ wd }}</span>
                }
              </div>
              <div class="muk-dp-grid">
                @for (cell of daysGrid(); track $index) {
                  <button
                    type="button"
                    class="muk-dp-cell muk-dp-day"
                    [class.is-other]="cell.otherMonth"
                    [class.is-today]="cell.today"
                    [class.is-selected]="cell.selected"
                    [class.is-disabled]="cell.disabled"
                    [disabled]="cell.disabled"
                    (click)="selectDay(cell.date)"
                  >{{ cell.day }}</button>
                }
              </div>
            }

            <!-- MONTH VIEW -->
            @if (currentView() === 'months') {
              <div class="muk-dp-months">
                @for (m of locale.monthsShort; track $index; let i = $index) {
                  <button
                    type="button"
                    class="muk-dp-cell muk-dp-month"
                    [class.is-selected]="i === selectedDate()?.getMonth() && viewYear() === selectedDate()?.getFullYear()"
                    [class.is-current]="i === viewMonth()"
                    (click)="selectMonth(i)"
                  >{{ m }}</button>
                }
              </div>
            }

            <!-- YEAR VIEW -->
            @if (currentView() === 'years') {
              <div class="muk-dp-years">
                @for (y of yearGrid(); track y) {
                  <button
                    type="button"
                    class="muk-dp-cell muk-dp-year"
                    [class.is-selected]="y === selectedDate()?.getFullYear()"
                    [class.is-current]="y === viewYear()"
                    (click)="selectYear(y)"
                  >{{ y }}</button>
                }
              </div>
            }
          </div>

          <!-- FOOTER -->
          <div class="muk-dp-pop-footer">
            <button type="button" class="muk-dp-footer-btn" (click)="goToday()">
              {{ locale.today }}
            </button>
            @if (clearable) {
              <button type="button" class="muk-dp-footer-btn is-ghost" (click)="clear()">
                {{ locale.clear }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
    styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements ControlValueAccessor, AfterViewInit {
    // ── INPUTS ──

    @Input() label?: string;
    @Input() placeholder = 'Select date';
    @Input() helperText?: string;
    @Input() errorMessage?: string;

    @Input() size: MukDatePickerSize = 'md';
    @Input() labelStyle: 'floating' | 'top' | 'none' = 'floating';

    @Input() disabled = false;
    @Input() readonly = false;
    @Input() required = false;
    @Input() clearable = true;

    /** Date format - tokens: yyyy, yy, MMMM, MMM, MM, M, dd, d */
    @Input() format = 'dd/MM/yyyy';

    /** Min selectable date (inclusive). */
    @Input() min?: Date | string;

    /** Max selectable date (inclusive). */
    @Input() max?: Date | string;

    /** Days of week to disable (0=Sun..6=Sat). */
    @Input() disabledDays: number[] = [];

    /** Custom predicate for disabling dates. */
    @Input() disabledDateFn?: (date: Date) => boolean;

    /** 0=Sunday, 1=Monday. Default 1 (Mon). */
    @Input() weekStartsOn: 0 | 1 = 1;

    /** Localization. */
    @Input() locale: MukDatePickerLocale = MUK_DEFAULT_LOCALE;


    // ── OUTPUTS ──

    @Output() dateChange = new EventEmitter<Date | null>();
    @Output() opened = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();


    // ── STATE ──

    readonly selectedDate = signal<Date | null>(null);
    readonly isOpen = signal(false);
    readonly currentView = signal<MukDatePickerView>('days');

    // Calendar's current "view" month/year (independent of selection)
    readonly viewMonth = signal(new Date().getMonth());
    readonly viewYear = signal(new Date().getFullYear());

    // Year grid range (12-year window)
    private readonly yearRangeStart = signal(Math.floor(new Date().getFullYear() / 12) * 12);


    // ── ELEMENT REF ──

    private host = inject<ElementRef<HTMLElement>>(ElementRef);
    @ViewChild('popup') popupRef?: ElementRef<HTMLElement>;


    // ── CVA ──

    private onChange: (v: Date | null) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(v: Date | string | null): void {
        if (!v) {
            this.selectedDate.set(null);
            return;
        }
        const d = v instanceof Date ? v : this.parseDate(v);
        if (d && !isNaN(d.getTime())) {
            this.selectedDate.set(d);
            this.viewMonth.set(d.getMonth());
            this.viewYear.set(d.getFullYear());
        }
    }
    registerOnChange(fn: (v: Date | null) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(d: boolean): void { this.disabled = d; }


    ngAfterViewInit(): void { }


    // ── COMPUTED ──

    /** Display value formatted using `format`. */
    readonly displayValue = computed(() => {
        const d = this.selectedDate();
        return d ? this.formatDate(d, this.format) : '';
    });

    /** Weekday labels reordered per weekStartsOn. */
    readonly weekdayLabels = computed(() => {
        const labels = this.locale.weekdaysShort;
        return this.weekStartsOn === 1
            ? [...labels.slice(1), labels[0]]
            : labels;
    });

    /** 42 cells (6 weeks × 7 days) for the current view month. */
    readonly daysGrid = computed(() => {
        const year = this.viewYear();
        const month = this.viewMonth();
        const first = new Date(year, month, 1);
        const firstDow = first.getDay();
        const offset = (firstDow - this.weekStartsOn + 7) % 7;

        // Start date = first of month - offset
        const start = new Date(year, month, 1 - offset);
        const cells = [];
        const sel = this.selectedDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 42; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            d.setHours(0, 0, 0, 0);

            const otherMonth = d.getMonth() !== month;
            const isToday = d.getTime() === today.getTime();
            const isSelected = !!sel && d.getTime() === new Date(sel.getFullYear(), sel.getMonth(), sel.getDate()).getTime();
            const isDisabled = this.isDateDisabled(d);

            cells.push({
                date: d,
                day: d.getDate(),
                otherMonth,
                today: isToday,
                selected: isSelected,
                disabled: isDisabled,
            });
        }
        return cells;
    });

    readonly yearGrid = computed(() => {
        const start = this.yearRangeStart();
        return Array.from({ length: 12 }, (_, i) => start + i);
    });

    readonly yearRangeLabel = computed(() => {
        const s = this.yearRangeStart();
        return `${s} – ${s + 11}`;
    });


    get hostClasses(): Record<string, boolean> {
        return {
            [`muk-dp-size-${this.size}`]: true,
            [`muk-dp-label-${this.labelStyle}`]: true,
            'is-disabled': this.disabled,
            'is-open': this.isOpen(),
        };
    }


    // ── INTERACTION ──

    toggle(event: MouseEvent): void {
        event.stopPropagation();
        if (this.disabled || this.readonly) return;
        this.isOpen() ? this.close() : this.open();
    }

    open(): void {
        if (this.disabled || this.readonly) return;
        // Reset view to selected date or today
        const ref = this.selectedDate() ?? new Date();
        this.viewMonth.set(ref.getMonth());
        this.viewYear.set(ref.getFullYear());
        this.currentView.set('days');
        this.isOpen.set(true);
        this.opened.emit();
    }

    close(): void {
        if (!this.isOpen()) return;
        this.isOpen.set(false);
        this.onTouched();
        this.closed.emit();
    }

    onClear(event: MouseEvent): void {
        event.stopPropagation();
        this.clear();
    }

    clear(): void {
        this.selectedDate.set(null);
        this.onChange(null);
        this.dateChange.emit(null);
    }

    goToday(): void {
        const t = new Date();
        this.viewMonth.set(t.getMonth());
        this.viewYear.set(t.getFullYear());
        this.currentView.set('days');
        if (!this.isDateDisabled(t)) {
            this.selectDay(t);
        }
    }


    // ── VIEW SWITCHING ──

    toggleView(): void {
        const v = this.currentView();
        if (v === 'days') this.currentView.set('months');
        else if (v === 'months') {
            this.yearRangeStart.set(Math.floor(this.viewYear() / 12) * 12);
            this.currentView.set('years');
        } else this.currentView.set('days');
    }

    prev(): void {
        const v = this.currentView();
        if (v === 'days') {
            if (this.viewMonth() === 0) {
                this.viewMonth.set(11);
                this.viewYear.update(y => y - 1);
            } else this.viewMonth.update(m => m - 1);
        } else if (v === 'months') {
            this.viewYear.update(y => y - 1);
        } else {
            this.yearRangeStart.update(s => s - 12);
        }
    }

    next(): void {
        const v = this.currentView();
        if (v === 'days') {
            if (this.viewMonth() === 11) {
                this.viewMonth.set(0);
                this.viewYear.update(y => y + 1);
            } else this.viewMonth.update(m => m + 1);
        } else if (v === 'months') {
            this.viewYear.update(y => y + 1);
        } else {
            this.yearRangeStart.update(s => s + 12);
        }
    }


    // ── SELECTION ──

    selectDay(d: Date): void {
        if (this.isDateDisabled(d)) return;
        const norm = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        this.selectedDate.set(norm);
        this.viewMonth.set(norm.getMonth());
        this.viewYear.set(norm.getFullYear());
        this.onChange(norm);
        this.dateChange.emit(norm);
        this.close();
    }

    selectMonth(monthIndex: number): void {
        this.viewMonth.set(monthIndex);
        this.currentView.set('days');
    }

    selectYear(year: number): void {
        this.viewYear.set(year);
        this.currentView.set('months');
    }


    // ── HELPERS ──

    private isDateDisabled(d: Date): boolean {
        const minD = this.parseDate(this.min);
        const maxD = this.parseDate(this.max);
        if (minD && d < this.stripTime(minD)) return true;
        if (maxD && d > this.stripTime(maxD)) return true;
        if (this.disabledDays.includes(d.getDay())) return true;
        if (this.disabledDateFn && this.disabledDateFn(d)) return true;
        return false;
    }

    private stripTime(d: Date): Date {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    private parseDate(v: Date | string | undefined | null): Date | null {
        if (!v) return null;
        if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
    }

    private formatDate(d: Date, fmt: string): string {
        const pad = (n: number, w = 2) => String(n).padStart(w, '0');
        const day = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();

        return fmt
            .replace(/yyyy/g, String(year))
            .replace(/yy/g, String(year).slice(-2))
            .replace(/MMMM/g, this.locale.months[month])
            .replace(/MMM/g, this.locale.monthsShort[month])
            .replace(/MM/g, pad(month + 1))
            .replace(/(?<!M)M(?!M)/g, String(month + 1))
            .replace(/dd/g, pad(day))
            .replace(/(?<!d)d(?!d)/g, String(day));
    }


    // ── OUTSIDE CLICK / ESC ──

    @HostListener('document:click', ['$event'])
    onDocClick(event: MouseEvent): void {
        if (!this.isOpen()) return;
        const t = event.target as Node;
        if (!this.host.nativeElement.contains(t)) {
            this.close();
        }
    }

    @HostListener('document:keydown.escape')
    onEsc(): void {
        if (this.isOpen()) this.close();
    }
}