// ============================================================
// MUK Data Table - Type Definitions
// ============================================================
import { TemplateRef } from '@angular/core';

export type MukSortDirection = 'asc' | 'desc' | null;
export type MukTableSize = 'sm' | 'md' | 'lg';
export type MukTableVariant = 'default' | 'striped' | 'bordered' | 'minimal';
export type MukColumnAlign = 'left' | 'center' | 'right';
export type MukColumnFilterType = 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'date-range' | 'boolean' | 'none';

/**
 * Column definition - the heart of the table configuration.
 * Define each column you want to show via [columns]="[...]" input.
 */
export interface MukTableColumn<T = any> {
    /** Unique identifier - usually the field name in your data object. */
    key: string;

    /** Header text shown in the table. */
    label?: string;

    /** Object path to read value (e.g. 'user.name'). Defaults to `key`. */
    field?: string;

    /** Column width: '120px', '20%', '1fr'. */
    width?: string;

    /** Min width (responsive). */
    minWidth?: string;

    /** Max width. */
    maxWidth?: string;

    /** Cell alignment. */
    align?: MukColumnAlign;

    /** Show in table. */
    visible?: boolean;

    /** Sticky position. */
    sticky?: 'left' | 'right' | false;

    // ── SORTING ──
    sortable?: boolean;
    /** Custom comparator. Receives raw row objects. */
    sortFn?: (a: T, b: T, dir: 'asc' | 'desc') => number;

    // ── FILTERING ──
    filterable?: boolean;
    filterType?: MukColumnFilterType;
    /** For select/multi-select. Static or () => options. */
    filterOptions?: Array<{ label: string; value: any }>;
    filterPlaceholder?: string;
    /** Custom filter predicate (returns true to KEEP row). */
    filterFn?: (row: T, filterValue: any) => boolean;

    // ── DISPLAY ──
    /** Format the cell value (e.g. currency, date). */
    format?: (value: any, row: T) => string;
    /** Cell CSS class - static or function. */
    cellClass?: string | ((value: any, row: T) => string);
    /** Header CSS class. */
    headerClass?: string;

    /** Render as raw HTML (only use with sanitized content). */
    html?: boolean;

    /** Hide on small screens. */
    hideOnMobile?: boolean;

    /** Skeleton width when loading (defaults to '80%'). */
    skeletonWidth?: string;

    // ── EXPORT ──
    exportable?: boolean;
    /** Value transformer for export (CSV/Excel). Defaults to format or raw. */
    exportFormat?: (value: any, row: T) => string;
}


/**
 * Action button definition for the actions column.
 */
export interface MukTableAction<T = any> {
    /** Unique action ID. */
    id: string;

    /** Button label - string or function. */
    label?: string | ((row: T) => string);

    /** Icon class (e.g. 'bi bi-eye'). */
    icon?: string | ((row: T) => string);

    /** Tooltip text. */
    tooltip?: string | ((row: T) => string);

    /** Button variant. */
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
    buttonStyle?: 'solid' | 'soft' | 'outline' | 'ghost';

    /** Show as icon-only (good for compact rows). */
    iconOnly?: boolean;

    /** Show this action for this row? (default: true) */
    show?: (row: T) => boolean;

    /** Disable this action for this row? */
    disabled?: (row: T) => boolean;

    /** Click handler - receives the row and the action. */
    handler: (row: T, action: MukTableAction<T>) => void;
}


/**
 * Bulk action - operates on multiple selected rows.
 */
export interface MukTableBulkAction<T = any> {
    id: string;
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
    buttonStyle?: 'solid' | 'soft' | 'outline' | 'ghost';
    /** Confirm before running? */
    confirm?: boolean | { title: string; message: string };
    handler: (rows: T[]) => void;
}


/**
 * Server-side request shape - emitted whenever any user action requires re-fetch.
 * Subscribe to (request) and refresh `[data]` + `[totalItems]`.
 */
export interface MukTableRequest {
    page: number;          // 1-indexed
    pageSize: number;
    search?: string;
    sortBy?: string;       // column key
    sortDir?: 'asc' | 'desc';
    filters?: Record<string, any>;
}


/**
 * Current state of the table - emitted via (stateChange).
 */
export interface MukTableState<T = any> {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    search: string;
    sortBy: string | null;
    sortDir: MukSortDirection;
    filters: Record<string, any>;
    selectedRows: T[];
}


/**
 * Internal cell-template registration via [mukCellTpl] directive.
 */
export interface MukCellTemplateRef {
    columnKey: string;
    template: TemplateRef<any>;
}