import { Directive, Input, TemplateRef, inject } from '@angular/core';

/**
 * Mark a custom cell template for a specific column.
 *
 * USAGE:
 *   <muk-data-table [data]="rows" [columns]="cols">
 *     <ng-template mukCellTpl="status" let-row let-value="value">
 *       <muk-badge [variant]="row.statusColor">{{ value }}</muk-badge>
 *     </ng-template>
 *
 *     <ng-template mukCellTpl="user" let-row>
 *       <muk-avatar [src]="row.avatar" [name]="row.name"></muk-avatar>
 *       <span>{{ row.name }}</span>
 *     </ng-template>
 *   </muk-data-table>
 *
 * Context available in the template:
 *   let-row              → entire row object
 *   let-value="value"    → the formatted/raw cell value
 *   let-index="index"    → row index
 *   let-column="column"  → the column definition
 */
@Directive({
    selector: '[mukCellTpl]',
    standalone: true,
})
export class CellTemplateDirective {
    @Input('mukCellTpl') columnKey!: string;

    template = inject(TemplateRef<any>);
}


/**
 * Custom row-detail template for expandable rows / nested grids.
 *
 *   <ng-template mukRowDetail let-row>
 *     <muk-data-table [data]="row.items" [columns]="subCols"></muk-data-table>
 *   </ng-template>
 */
@Directive({
    selector: '[mukRowDetail]',
    standalone: true,
})
export class RowDetailDirective {
    template = inject(TemplateRef<any>);
}


/**
 * Empty state template - shown when no rows match.
 *
 *   <ng-template mukEmpty>
 *     <muk-empty-state icon="bi bi-search" title="No results" />
 *   </ng-template>
 */
@Directive({
    selector: '[mukEmpty]',
    standalone: true,
})
export class EmptyTemplateDirective {
    template = inject(TemplateRef<any>);
}