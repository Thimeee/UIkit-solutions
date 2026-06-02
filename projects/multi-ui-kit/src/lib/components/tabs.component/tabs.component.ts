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
    OnDestroy,
    ViewChild,
    TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

export type MukTabsVariant =
    | 'line'        // classic underlined tabs
    | 'pills'       // rounded pill buttons (filled when active)
    | 'segmented'   // grouped buttons inside a tinted container
    | 'enclosed'    // tabs sit inside a bordered "envelope"
    | 'soft';       // soft-tinted background when active

export type MukTabsAnimation =
    | 'fade'        // fade panels in/out
    | 'slide'       // slide panels horizontally
    | 'scale'       // scale up from 0.96
    | 'none';       // no animation

export type MukTabsSize = 'sm' | 'md' | 'lg';
export type MukTabsAlign = 'start' | 'center' | 'end' | 'stretch';
export type MukTabsOrientation = 'horizontal' | 'vertical';


/**
 * A single tab inside <muk-tabs>.
 *
 *   <muk-tab label="Profile" icon="bi bi-person">
 *     Profile content here
 *   </muk-tab>
 */
@Component({
    selector: 'muk-tab',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class TabComponent {
    /** Tab label (string). */
    @Input() label?: string;

    /** Optional leading icon class (e.g. 'bi bi-person'). */
    @Input() icon?: string;

    /** Optional badge text/number on the tab. */
    @Input() badge?: string | number;

    /** Unique value - used by [(value)] binding. Falls back to label. */
    @Input() value?: any;

    /** Disabled tab. */
    @Input() disabled = false;

    /** Event when this tab becomes active. */
    @Output() activated = new EventEmitter<void>();

    /** Inner template (the projected body). */
    @ViewChild('content', { static: true }) content!: TemplateRef<any>;

    /** Resolved value used for matching. */
    get resolvedValue(): any {
        return this.value !== undefined ? this.value : this.label;
    }
}


/**
 * MUK Tabs - flexible tabbed interface.
 *
 * ── USAGE ──
 *
 *   <muk-tabs>
 *     <muk-tab label="Profile">Profile content</muk-tab>
 *     <muk-tab label="Settings">Settings content</muk-tab>
 *     <muk-tab label="Billing" badge="3">Billing content</muk-tab>
 *   </muk-tabs>
 *
 * Variants:
 *   <muk-tabs variant="line">      Classic underline (default)
 *   <muk-tabs variant="pills">     Rounded pill buttons
 *   <muk-tabs variant="segmented"> Grouped button bar
 *   <muk-tabs variant="enclosed">  Bordered envelope
 *   <muk-tabs variant="soft">      Tinted active state
 *
 * Animations: fade (default) | slide | scale | none
 *
 * Two-way value binding:
 *   <muk-tabs [(value)]="active">
 *     <muk-tab value="profile" label="Profile">...</muk-tab>
 *   </muk-tabs>
 *
 * Vertical:
 *   <muk-tabs orientation="vertical">...</muk-tabs>
 */
@Component({
    selector: 'muk-tabs',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [ngClass]="hostClasses">
      <!-- HEADER (tab list) -->
      <div class="muk-tabs-header" role="tablist" [attr.aria-orientation]="orientation">
        @for (tab of tabs; track $index; let i = $index) {
          <button
            type="button"
            class="muk-tabs-tab"
            [class.is-active]="i === activeIndex()"
            [class.is-disabled]="tab.disabled"
            role="tab"
            [attr.aria-selected]="i === activeIndex()"
            [attr.aria-disabled]="tab.disabled"
            [attr.tabindex]="i === activeIndex() ? 0 : -1"
            [disabled]="tab.disabled"
            (click)="select(i)"
            (keydown)="onKeydown($event, i)"
          >
            @if (tab.icon) {
              <i class="muk-tabs-icon" [class]="tab.icon"></i>
            }
            <span class="muk-tabs-label">{{ tab.label }}</span>
            @if (tab.badge !== undefined && tab.badge !== null) {
              <span class="muk-tabs-badge">{{ tab.badge }}</span>
            }
          </button>
        }
      </div>

      <!-- PANEL (active content) -->
      <div
        class="muk-tabs-body"
        [class.anim-fade]="animation === 'fade'"
        [class.anim-slide]="animation === 'slide'"
        [class.anim-scale]="animation === 'scale'"
      >
        @for (tab of tabs; track $index; let i = $index) {
          @if (keepAlive || i === activeIndex()) {
            <div
              class="muk-tabs-panel"
              role="tabpanel"
              [class.is-active]="i === activeIndex()"
              [attr.hidden]="i === activeIndex() ? null : true"
            >
              <ng-container *ngTemplateOutlet="tab.content"></ng-container>
            </div>
          }
        }
      </div>
    </div>
  `,
    styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit, OnDestroy {
    // ── APPEARANCE ──

    @Input() variant: MukTabsVariant = 'line';
    @Input() animation: MukTabsAnimation = 'fade';
    @Input() size: MukTabsSize = 'md';
    @Input() align: MukTabsAlign = 'start';
    @Input() orientation: MukTabsOrientation = 'horizontal';

    /** Full-width tabs (each tab grows equally). */
    @Input() fullWidth = false;

    /** Keep inactive panels mounted (preserves state but uses more memory). */
    @Input() keepAlive = false;


    // ── VALUE (two-way bound) ──

    @Input() set value(v: any) {
        if (v === undefined || v === null) return;
        this._value = v;
        queueMicrotask(() => this.syncIndexFromValue());
    }
    get value(): any { return this._value; }
    private _value: any;

    @Output() valueChange = new EventEmitter<any>();
    @Output() indexChange = new EventEmitter<number>();


    // ── STATE ──

    readonly activeIndex = signal(0);
    tabs: TabComponent[] = [];

    @ContentChildren(TabComponent) tabsQuery!: QueryList<TabComponent>;

    private sub?: Subscription;

    constructor(private cdr: ChangeDetectorRef) { }

    ngAfterContentInit(): void {
        this.tabs = this.tabsQuery.toArray();

        // Initial active tab - first non-disabled, or sync from value
        if (this._value !== undefined) {
            this.syncIndexFromValue();
        } else {
            const firstEnabled = this.tabs.findIndex(t => !t.disabled);
            if (firstEnabled >= 0) this.activeIndex.set(firstEnabled);
        }

        // React to tab list changes
        this.sub = this.tabsQuery.changes.subscribe(() => {
            this.tabs = this.tabsQuery.toArray();
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }


    // ── ACTIONS ──

    select(index: number): void {
        const tab = this.tabs[index];
        if (!tab || tab.disabled || index === this.activeIndex()) return;
        this.activeIndex.set(index);
        this._value = tab.resolvedValue;
        this.valueChange.emit(this._value);
        this.indexChange.emit(index);
        tab.activated.emit();
        this.cdr.markForCheck();
    }

    onKeydown(event: KeyboardEvent, currentIndex: number): void {
        const horiz = this.orientation === 'horizontal';
        const next = horiz ? 'ArrowRight' : 'ArrowDown';
        const prev = horiz ? 'ArrowLeft' : 'ArrowUp';

        if (event.key === next) {
            event.preventDefault();
            this.select(this.findNextEnabled(currentIndex, +1));
        } else if (event.key === prev) {
            event.preventDefault();
            this.select(this.findNextEnabled(currentIndex, -1));
        } else if (event.key === 'Home') {
            event.preventDefault();
            this.select(this.findNextEnabled(-1, +1));
        } else if (event.key === 'End') {
            event.preventDefault();
            this.select(this.findNextEnabled(this.tabs.length, -1));
        }
    }


    // ── INTERNAL ──

    private findNextEnabled(fromIndex: number, dir: 1 | -1): number {
        const n = this.tabs.length;
        for (let step = 1; step <= n; step++) {
            const i = (fromIndex + dir * step + n) % n;
            if (!this.tabs[i].disabled) return i;
        }
        return this.activeIndex();
    }

    private syncIndexFromValue(): void {
        if (!this.tabs.length) return;
        const idx = this.tabs.findIndex(t => t.resolvedValue === this._value);
        if (idx >= 0 && idx !== this.activeIndex()) {
            this.activeIndex.set(idx);
            this.cdr.markForCheck();
        }
    }


    // ── COMPUTED ──

    get hostClasses(): Record<string, boolean> {
        return {
            'muk-tabs': true,
            [`muk-tabs-variant-${this.variant}`]: true,
            [`muk-tabs-size-${this.size}`]: true,
            [`muk-tabs-align-${this.align}`]: true,
            [`muk-tabs-orient-${this.orientation}`]: true,
            'is-full-width': this.fullWidth,
        };
    }
}