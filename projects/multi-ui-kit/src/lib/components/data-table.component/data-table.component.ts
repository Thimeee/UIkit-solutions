import {
    Component,
    Input,
    Output,
    EventEmitter,
    ContentChildren,
    ContentChild,
    QueryList,
    AfterContentInit,
    ChangeDetectionStrategy,
    signal,
    computed,
    ChangeDetectorRef,
    OnInit,
    OnChanges,
    SimpleChanges,
    inject,
    DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonComponent } from '../button.component/button.component';
import { InputComponent } from '../input.component/input.component';
import { CheckboxComponent } from '../checkbox.component/checkbox.component';
import { SelectComponent, MukSelectOption } from '../select.component/select.component';
import { DatePickerComponent } from '../date-picker.component/date-picker.component';
import { PaginationComponent } from '../pagination.component/pagination.component';
import { SkeletonComponent } from '../skeleton.component/skeleton.component';
import { EmptyStateComponent } from '../empty-state.component/empty-state.component';
import { ChipComponent } from '../chip.component/chip.component';
import { TooltipDirective } from '../tooltip.directive.component/tooltip.directive';

import {
    MukTableColumn,
    MukTableAction,
    MukTableBulkAction,
    MukTableRequest,
    MukTableState,
    MukSortDirection,
    MukTableSize,
    MukTableVariant,
} from './data-table.types';

import {
    CellTemplateDirective,
    RowDetailDirective,
    EmptyTemplateDirective,
} from './cell-template.directive';

/**
 * MUK Data Table - flagship data display component.
 *
 * Supports:
 *   - Client-side OR server-side data
 *   - Search, sort, per-column filters, pagination
 *   - Single + multi row selection (with bulk actions)
 *   - Configurable per-row action buttons
 *   - Expandable rows for nested data
 *   - Custom cell templates
 *   - Loading skeleton + empty state
 *   - Column visibility toggle
 *   - Sticky header, responsive scroll
 *
 * ── BASIC USAGE (client-side) ──
 *
 *   <muk-data-table
 *     [data]="users"
 *     [columns]="cols"
 *     [actions]="actions"
 *     [(page)]="page"
 *     [(pageSize)]="pageSize"
 *   ></muk-data-table>
 *
 * ── SERVER-SIDE ──
 *
 *   <muk-data-table
 *     [data]="users"
 *     [totalItems]="totalCount"
 *     [columns]="cols"
 *     [serverSide]="true"
 *     (request)="onTableRequest($event)"
 *     [loading]="loading"
 *   ></muk-data-table>
 */
@Component({
    selector: 'muk-data-table',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        ButtonComponent, InputComponent, CheckboxComponent,
        SelectComponent, DatePickerComponent, PaginationComponent,
        SkeletonComponent, EmptyStateComponent, ChipComponent,
        TooltipDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T = any> implements OnInit, OnChanges, AfterContentInit {
    // ══════════════════════════════════════════════════════════
    // ─── DATA INPUTS ──
    // ══════════════════════════════════════════════════════════

    @Input() data: T[] = [];
    @Input() columns: MukTableColumn<T>[] = [];
    @Input() actions: MukTableAction<T>[] = [];
    @Input() bulkActions: MukTableBulkAction<T>[] = [];

    /** Total items - REQUIRED for server-side. */
    @Input() totalItems?: number;

    /** Server-side mode - emits (request), doesn't sort/filter/paginate locally. */
    @Input() serverSide = false;

    /** Row unique identifier - 'id' by default. Used for selection tracking. */
    @Input() trackBy: string | ((row: T) => any) = 'id';


    // ══════════════════════════════════════════════════════════
    // ─── APPEARANCE ──
    // ══════════════════════════════════════════════════════════

    @Input() size: MukTableSize = 'md';
    @Input() variant: MukTableVariant = 'default';

    /** Show top toolbar (search + filters chip + actions slot). */
    @Input() showToolbar = true;

    /** Show search input in toolbar. */
    @Input() showSearch = true;
    @Input() searchPlaceholder = 'Search...';

    /** Search debounce ms. */
    @Input() searchDebounce = 300;

    /** Show "Refresh" button. */
    @Input() showRefresh = false;

    /** Show column visibility toggle. */
    @Input() showColumnToggle = false;

    /** Show row count info on bottom-left. */
    @Input() showRowCount = true;

    /** Title shown in toolbar. */
    @Input() title?: string;


    // ══════════════════════════════════════════════════════════
    // ─── SELECTION ──
    // ══════════════════════════════════════════════════════════

    /** Enable row selection. */
    @Input() selectable: false | 'single' | 'multi' = false;

    /** Pre-selected rows. */
    @Input() selectedRows: T[] = [];

    /** Disable selection for specific rows. */
    @Input() selectableFn: (row: T) => boolean = () => true;


    // ══════════════════════════════════════════════════════════
    // ─── PAGINATION (two-way) ──
    // ══════════════════════════════════════════════════════════

    @Input() page = 1;
    @Input() pageSize = 10;
    @Input() pageSizeOptions = [10, 25, 50, 100];
    @Input() showPagination = true;


    // ══════════════════════════════════════════════════════════
    // ─── STATE ──
    // ══════════════════════════════════════════════════════════

    @Input() loading = false;
    @Input() loadingRowCount = 5;

    /** Custom empty state text. */
    @Input() emptyIcon = 'bi bi-inbox';
    @Input() emptyTitle = 'No data';
    @Input() emptyDescription = 'No results to display.';


    // ══════════════════════════════════════════════════════════
    // ─── EXPANDABLE ROWS (nested grids) ──
    // ══════════════════════════════════════════════════════════

    /** Enable expandable rows (requires <ng-template mukRowDetail>). */
    @Input() expandable = false;

    /** Whether to show the expand caret for this row (default: all expandable). */
    @Input() expandableFn: (row: T) => boolean = () => true;

    /** Only one expanded at a time. */
    @Input() singleExpand = false;


    // ══════════════════════════════════════════════════════════
    // ─── FEATURES ──
    // ══════════════════════════════════════════════════════════

    /** Sticky header (when table scrolls). */
    @Input() stickyHeader = true;

    /** Max height (enables vertical scroll). */
    @Input() maxHeight?: string;

    /** Initial sort. */
    @Input() initialSortBy?: string;
    @Input() initialSortDir: 'asc' | 'desc' = 'asc';


    // ══════════════════════════════════════════════════════════
    // ─── EVENTS ──
    // ══════════════════════════════════════════════════════════

    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();
    @Output() selectedRowsChange = new EventEmitter<T[]>();
    @Output() rowClick = new EventEmitter<T>();
    @Output() sortChange = new EventEmitter<{ key: string | null; dir: MukSortDirection }>();
    @Output() filterChange = new EventEmitter<Record<string, any>>();
    @Output() searchChange = new EventEmitter<string>();

    /** Emitted on ANY state change - subscribe in server-side mode to refetch. */
    @Output() request = new EventEmitter<MukTableRequest>();
    @Output() stateChange = new EventEmitter<MukTableState<T>>();
    @Output() refresh = new EventEmitter<void>();


    // ══════════════════════════════════════════════════════════
    // ─── CONTENT (templates) ──
    // ══════════════════════════════════════════════════════════

    @ContentChildren(CellTemplateDirective) cellTemplates!: QueryList<CellTemplateDirective>;
    @ContentChild(RowDetailDirective) rowDetailTpl?: RowDetailDirective;
    @ContentChild(EmptyTemplateDirective) emptyTpl?: EmptyTemplateDirective;


    // ══════════════════════════════════════════════════════════
    // ─── INTERNAL STATE (signals) ──
    // ══════════════════════════════════════════════════════════

    readonly searchTerm = signal('');
    readonly sortKey = signal<string | null>(null);
    readonly sortDir = signal<MukSortDirection>(null);
    readonly filters = signal<Record<string, any>>({});
    readonly expandedRows = signal<Set<any>>(new Set());
    readonly columnVisibility = signal<Record<string, boolean>>({});
    readonly showFiltersPanel = signal(false);
    readonly showColumnPanel = signal(false);

    private searchSubject = new Subject<string>();
    private destroyRef = inject(DestroyRef);


    // ══════════════════════════════════════════════════════════
    // ─── COMPUTED ──
    // ══════════════════════════════════════════════════════════

    /** Visible columns (after column-visibility filter). */
    readonly visibleColumns = computed(() => {
        const vis = this.columnVisibility();
        return this.columns.filter(c => {
            const v = vis[c.key];
            return v !== false && c.visible !== false;
        });
    });

    /** Total displayed columns count (for layout calculations). */
    totalColumnCount(): number {
        let n = this.visibleColumns().length;
        if (this.selectable) n++;
        if (this.expandable) n++;
        if (this.actions.length > 0) n++;
        return n;
    }

    /** Client-side processed data (sort + filter + search). */
    readonly processedData = computed(() => {
        if (this.serverSide) return this.data;

        let rows = [...(this.data || [])];

        // 1. Search
        const term = this.searchTerm().trim().toLowerCase();
        if (term) {
            rows = rows.filter(row => {
                return this.columns.some(col => {
                    if (col.filterable === false) return false;
                    const val = this.getValue(row, col);
                    if (val === null || val === undefined) return false;
                    return String(val).toLowerCase().includes(term);
                });
            });
        }

        // 2. Column filters
        const flt = this.filters();
        Object.keys(flt).forEach(key => {
            const filterValue = flt[key];
            if (filterValue === null || filterValue === undefined || filterValue === '' ||
                (Array.isArray(filterValue) && filterValue.length === 0)) return;

            const col = this.columns.find(c => c.key === key);
            if (!col) return;

            rows = rows.filter(row => {
                if (col.filterFn) return col.filterFn(row, filterValue);
                const val = this.getValue(row, col);
                return this.defaultFilterMatch(val, filterValue, col.filterType);
            });
        });

        // 3. Sort
        const sortKey = this.sortKey();
        const sortDir = this.sortDir();
        if (sortKey && sortDir) {
            const col = this.columns.find(c => c.key === sortKey);
            rows.sort((a, b) => {
                if (col?.sortFn) return col.sortFn(a, b, sortDir);
                const va = this.getValue(a, col);
                const vb = this.getValue(b, col);
                return this.defaultCompare(va, vb) * (sortDir === 'asc' ? 1 : -1);
            });
        }

        return rows;
    });

    /** Paginated rows (current page only, client-side). */
    readonly displayRows = computed(() => {
        if (this.serverSide) return this.data;
        const all = this.processedData();
        const start = (this.page - 1) * this.pageSize;
        return all.slice(start, start + this.pageSize);
    });

    /** Total items (computed for client-side). */
    readonly resolvedTotal = computed(() => {
        if (this.serverSide) return this.totalItems ?? 0;
        return this.processedData().length;
    });

    /** Active filter chips for display. */
    readonly activeFilterChips = computed(() => {
        const flt = this.filters();
        return Object.keys(flt)
            .filter(k => {
                const v = flt[k];
                return v !== null && v !== undefined && v !== '' &&
                    !(Array.isArray(v) && v.length === 0);
            })
            .map(k => {
                const col = this.columns.find(c => c.key === k);
                return { key: k, label: col?.label || k, value: this.formatFilterValue(flt[k]) };
            });
    });

    /** Are all displayed rows selected? */
    readonly allSelected = computed(() => {
        const rows = this.displayRows();
        if (!rows.length) return false;
        return rows.every(r => this.isRowSelected(r));
    });

    /** Some (but not all) rows selected? */
    readonly someSelected = computed(() => {
        const rows = this.displayRows();
        if (!rows.length) return false;
        return rows.some(r => this.isRowSelected(r)) && !this.allSelected();
    });


    // ══════════════════════════════════════════════════════════
    // ─── LIFECYCLE ──
    // ══════════════════════════════════════════════════════════

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        // Initialize column visibility
        const vis: Record<string, boolean> = {};
        this.columns.forEach(c => vis[c.key] = c.visible !== false);
        this.columnVisibility.set(vis);

        // Initial sort
        if (this.initialSortBy) {
            this.sortKey.set(this.initialSortBy);
            this.sortDir.set(this.initialSortDir);
        }

        // Debounced search
        this.searchSubject.pipe(
            debounceTime(this.searchDebounce),
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(term => {
            this.searchTerm.set(term);
            this.page = 1;
            this.pageChange.emit(1);
            this.searchChange.emit(term);
            this.emitState();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['columns']) {
            const vis: Record<string, boolean> = {};
            this.columns.forEach(c => vis[c.key] = c.visible !== false);
            this.columnVisibility.set(vis);
        }
    }

    ngAfterContentInit(): void {
        // Trigger CD when templates are projected
        this.cellTemplates.changes.pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(() => this.cdr.markForCheck());
    }


    // ══════════════════════════════════════════════════════════
    // ─── HELPERS ──
    // ══════════════════════════════════════════════════════════

    /** Read a value from a row using col.field or col.key (supports nested paths). */
    getValue(row: T, col?: MukTableColumn<T>): any {
        if (!col || !row) return '';
        const path = col.field || col.key;
        return path.split('.').reduce<any>((acc, k) => acc?.[k], row);
    }

    /** Format cell value via col.format. */
    formatValue(row: T, col: MukTableColumn<T>): any {
        const val = this.getValue(row, col);
        if (col.format) return col.format(val, row);
        return val;
    }

    /** Get the custom template for a column key, if any. */
    getCellTemplate(key: string) {
        return this.cellTemplates?.find(t => t.columnKey === key)?.template;
    }

    /** Get unique row identifier for tracking/selection. */
    getRowKey(row: T): any {
        if (typeof this.trackBy === 'function') return this.trackBy(row);
        return (row as any)?.[this.trackBy];
    }

    /** Track by for *ngFor. */
    trackRow = (_i: number, row: T): any => this.getRowKey(row);

    /** Cell CSS class. */
    cellClassFor(row: T, col: MukTableColumn<T>): string {
        if (typeof col.cellClass === 'function') return col.cellClass(this.getValue(row, col), row);
        return col.cellClass || '';
    }

    /** Default value compare for sorting. */
    private defaultCompare(a: any, b: any): number {
        if (a === b) return 0;
        if (a === null || a === undefined) return -1;
        if (b === null || b === undefined) return 1;
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
        return String(a).localeCompare(String(b));
    }

    /** Default filter match. */
    private defaultFilterMatch(val: any, filter: any, type?: string): boolean {
        if (val === null || val === undefined) return false;
        switch (type) {
            case 'select':
                return val === filter;
            case 'multi-select':
                return Array.isArray(filter) && filter.includes(val);
            case 'number':
                return Number(val) === Number(filter);
            case 'boolean':
                return Boolean(val) === Boolean(filter);
            case 'date':
                if (!(filter instanceof Date)) return true;
                return new Date(val).toDateString() === filter.toDateString();
            case 'date-range':
                if (!filter?.from && !filter?.to) return true;
                const d = new Date(val);
                if (filter.from && d < new Date(filter.from)) return false;
                if (filter.to && d > new Date(filter.to)) return false;
                return true;
            case 'text':
            default:
                return String(val).toLowerCase().includes(String(filter).toLowerCase());
        }
    }

    /** Filter value display formatter for chip badges. */
    private formatFilterValue(v: any): string {
        if (v instanceof Date) return v.toLocaleDateString();
        if (Array.isArray(v)) return v.length + ' selected';
        if (typeof v === 'object' && v?.from) return `${v.from} → ${v.to || '…'}`;
        return String(v);
    }


    // ══════════════════════════════════════════════════════════
    // ─── ACTIONS: SEARCH ──
    // ══════════════════════════════════════════════════════════

    onSearchInput(value: string): void {
        this.searchSubject.next(value);
    }


    // ══════════════════════════════════════════════════════════
    // ─── ACTIONS: SORT ──
    // ══════════════════════════════════════════════════════════

    sortBy(col: MukTableColumn<T>): void {
        if (col.sortable === false) return;
        if (col.sortable !== true && this.columns.find(c => c.key === col.key)?.sortable !== true) return;

        const currentKey = this.sortKey();
        const currentDir = this.sortDir();

        if (currentKey !== col.key) {
            this.sortKey.set(col.key);
            this.sortDir.set('asc');
        } else if (currentDir === 'asc') {
            this.sortDir.set('desc');
        } else {
            this.sortKey.set(null);
            this.sortDir.set(null);
        }

        this.sortChange.emit({ key: this.sortKey(), dir: this.sortDir() });
        this.page = 1;
        this.pageChange.emit(1);
        this.emitState();
    }


    // ══════════════════════════════════════════════════════════
    // ─── ACTIONS: FILTER ──
    // ══════════════════════════════════════════════════════════

    setFilter(key: string, value: any): void {
        const next = { ...this.filters(), [key]: value };
        if (value === null || value === undefined || value === '' ||
            (Array.isArray(value) && value.length === 0)) {
            delete next[key];
        }
        this.filters.set(next);
        this.page = 1;
        this.pageChange.emit(1);
        this.filterChange.emit(next);
        this.emitState();
    }

    clearFilter(key: string): void {
        const next = { ...this.filters() };
        delete next[key];
        this.filters.set(next);
        this.page = 1;
        this.pageChange.emit(1);
        this.filterChange.emit(next);
        this.emitState();
    }

    clearAllFilters(): void {
        this.filters.set({});
        this.searchTerm.set('');
        this.page = 1;
        this.pageChange.emit(1);
        this.filterChange.emit({});
        this.searchChange.emit('');
        this.emitState();
    }


    // ══════════════════════════════════════════════════════════
    // ─── ACTIONS: PAGINATION ──
    // ══════════════════════════════════════════════════════════

    onPageChange(p: number): void {
        this.page = p;
        this.pageChange.emit(p);
        this.emitState();
    }

    onPageSizeChange(s: number): void {
        this.pageSize = s;
        this.pageSizeChange.emit(s);
        this.emitState();
    }


    // ══════════════════════════════════════════════════════════
    // ─── ACTIONS: SELECTION ──
    // ══════════════════════════════════════════════════════════

    isRowSelected(row: T): boolean {
        const key = this.getRowKey(row);
        return this.selectedRows.some(r => this.getRowKey(r) === key);
    }

    toggleRow(row: T): void {
        if (!this.selectable) return;
        if (!this.selectableFn(row)) return;

        if (this.selectable === 'single') {
            this.selectedRows = this.isRowSelected(row) ? [] : [row];
        } else {
            if (this.isRowSelected(row)) {
                const key = this.getRowKey(row);
                this.selectedRows = this.selectedRows.filter(r => this.getRowKey(r) !== key);
            } else {
                this.selectedRows = [...this.selectedRows, row];
            }
        }
        this.selectedRowsChange.emit(this.selectedRows);
        this.cdr.markForCheck();
    }

    toggleAll(): void {
        if (this.selectable !== 'multi') return;
        const rows = this.displayRows();
        if (this.allSelected()) {
            const displayKeys = rows.map(r => this.getRowKey(r));
            this.selectedRows = this.selectedRows.filter(r => !displayKeys.includes(this.getRowKey(r)));
        } else {
            const selectable = rows.filter(r => this.selectableFn(r));
            const existing = this.selectedRows.map(r => this.getRowKey(r));
            const toAdd = selectable.filter(r => !existing.includes(this.getRowKey(r)));
            this.selectedRows = [...this.selectedRows, ...toAdd];
        }
        this.selectedRowsChange.emit(this.selectedRows);
        this.cdr.markForCheck();
    }

    clearSelection(): void {
        this.selectedRows = [];
        this.selectedRowsChange.emit([]);
    }


    // ══════════════════════════════════════════════════════════
    // ─── ACTIONS: EXPAND ──
    // ══════════════════════════════════════════════════════════

    isExpanded(row: T): boolean {
        return this.expandedRows().has(this.getRowKey(row));
    }

    toggleExpand(row: T, event?: Event): void {
        event?.stopPropagation();
        if (!this.expandable || !this.expandableFn(row)) return;
        const key = this.getRowKey(row);
        const next = new Set(this.singleExpand ? [] : this.expandedRows());
        if (this.expandedRows().has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        this.expandedRows.set(next);
    }


    // ══════════════════════════════════════════════════════════
    // ─── ACTIONS: COLUMN VISIBILITY ──
    // ══════════════════════════════════════════════════════════

    toggleColumn(key: string): void {
        const next = { ...this.columnVisibility() };
        next[key] = !next[key];
        this.columnVisibility.set(next);
    }


    // ══════════════════════════════════════════════════════════
    // ─── ACTIONS: ROW CLICK / ACTION ──
    // ══════════════════════════════════════════════════════════

    onRowClick(row: T, event: MouseEvent): void {
        // Don't fire row click on action button clicks
        if ((event.target as HTMLElement).closest('.muk-dt-action-btn, .muk-dt-checkbox, .muk-dt-expand-btn')) return;
        this.rowClick.emit(row);
    }

    onActionClick(action: MukTableAction<T>, row: T, event: MouseEvent): void {
        event.stopPropagation();
        if (action.disabled?.(row)) return;
        action.handler(row, action);
    }

    doRefresh(): void {
        this.refresh.emit();
        this.emitState();
    }


    // ══════════════════════════════════════════════════════════
    // ─── HELPERS for template ──
    // ══════════════════════════════════════════════════════════

    /** Get filter options for a select column. */
    getFilterSelectOptions(col: MukTableColumn<T>): MukSelectOption[] {
        return (col.filterOptions || []).map(o => ({ label: o.label, value: o.value }));
    }

    /** Action label resolver. */
    actionLabel(action: MukTableAction<T>, row: T): string {
        if (typeof action.label === 'function') return action.label(row);
        return action.label || '';
    }

    /** Action icon resolver. */
    actionIcon(action: MukTableAction<T>, row: T): string {
        if (typeof action.icon === 'function') return action.icon(row);
        return action.icon || '';
    }

    /** Action tooltip resolver. */
    actionTooltip(action: MukTableAction<T>, row: T): string {
        if (typeof action.tooltip === 'function') return action.tooltip(row);
        return action.tooltip || '';
    }

    /** Should this action show for this row? */
    actionVisible(action: MukTableAction<T>, row: T): boolean {
        return action.show ? action.show(row) : true;
    }

    /** Are there any filterable columns? */
    hasFilterableColumns(): boolean {
        return this.columns.some(c => c.filterable && c.filterType !== 'none');
    }

    /** Sort icon state for a column. */
    sortState(col: MukTableColumn<T>): 'none' | 'asc' | 'desc' {
        if (this.sortKey() !== col.key) return 'none';
        return this.sortDir() === 'asc' ? 'asc' : 'desc';
    }


    // ══════════════════════════════════════════════════════════
    // ─── EMIT STATE / REQUEST ──
    // ══════════════════════════════════════════════════════════

    private emitState(): void {
        const total = this.resolvedTotal();
        const state: MukTableState<T> = {
            page: this.page,
            pageSize: this.pageSize,
            totalItems: total,
            totalPages: Math.ceil(total / this.pageSize) || 1,
            search: this.searchTerm(),
            sortBy: this.sortKey(),
            sortDir: this.sortDir(),
            filters: this.filters(),
            selectedRows: this.selectedRows,
        };
        this.stateChange.emit(state);

        if (this.serverSide) {
            this.request.emit({
                page: this.page,
                pageSize: this.pageSize,
                search: this.searchTerm() || undefined,
                sortBy: this.sortKey() || undefined,
                sortDir: this.sortDir() || undefined,
                filters: { ...this.filters() },
            });
        }
    }


    // ══════════════════════════════════════════════════════════
    // ─── PUBLIC API ──
    // ══════════════════════════════════════════════════════════

    /** Reset all filters, search, sort, and page. */
    reset(): void {
        this.searchTerm.set('');
        this.sortKey.set(null);
        this.sortDir.set(null);
        this.filters.set({});
        this.page = 1;
        this.selectedRows = [];
        this.expandedRows.set(new Set());
        this.emitState();
    }


    // ══════════════════════════════════════════════════════════
    // ─── HOST CLASSES ──
    // ══════════════════════════════════════════════════════════

    get hostClasses(): Record<string, boolean> {
        return {
            'muk-dt': true,
            [`muk-dt-size-${this.size}`]: true,
            [`muk-dt-variant-${this.variant}`]: true,
            'has-sticky-header': this.stickyHeader,
            'is-loading': this.loading,
        };
    }
}