import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    computed,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukPaginationSize = 'sm' | 'md' | 'lg';
export type MukPaginationVariant = 'default' | 'rounded' | 'pill' | 'minimal';

/**
 * MUK Pagination - page navigation control.
 *
 * ── USAGE ──
 *
 * Basic (number of pages):
 *   <muk-pagination
 *     [totalItems]="250"
 *     [pageSize]="10"
 *     [(page)]="currentPage"
 *   ></muk-pagination>
 *
 * With page-size selector + info:
 *   <muk-pagination
 *     [totalItems]="totalCount"
 *     [(pageSize)]="pageSize"
 *     [(page)]="page"
 *     [pageSizeOptions]="[10, 25, 50, 100]"
 *     [showPageSize]="true"
 *     [showInfo]="true"
 *   ></muk-pagination>
 *
 * Minimal (just prev/next):
 *   <muk-pagination
 *     [totalItems]="100" [pageSize]="10" [(page)]="p"
 *     variant="minimal"
 *     [showPageSize]="false"
 *     [showInfo]="false"
 *   ></muk-pagination>
 *
 * Variants: default | rounded | pill | minimal
 * Sizes: sm | md | lg
 */
@Component({
    selector: 'muk-pagination',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [ngClass]="hostClasses">
      <!-- INFO / RANGE -->
      @if (showInfo && totalItems > 0) {
        <div class="muk-pg-info">
          {{ infoText() }}
        </div>
      }

      <!-- PAGE-SIZE SELECTOR -->
      @if (showPageSize && pageSizeOptions.length > 0) {
        <div class="muk-pg-pagesize">
          <span class="muk-pg-pagesize-label">{{ pageSizeLabel }}:</span>
          <select
            class="muk-pg-pagesize-select"
            [value]="pageSize"
            (change)="onPageSizeChange($event)"
            [attr.aria-label]="'Items per page'"
          >
            @for (s of pageSizeOptions; track s) {
              <option [value]="s">{{ s }}</option>
            }
          </select>
        </div>
      }

      <!-- NAV BUTTONS -->
      <nav class="muk-pg-nav" role="navigation" [attr.aria-label]="'Pagination'">
        <ul class="muk-pg-list">
          @if (showFirstLast) {
            <li>
              <button
                type="button"
                class="muk-pg-btn muk-pg-jump"
                [disabled]="isFirst()"
                (click)="goTo(1)"
                [attr.aria-label]="'First page'"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="11 17 6 12 11 7"/>
                  <polyline points="18 17 13 12 18 7"/>
                </svg>
              </button>
            </li>
          }

          <li>
            <button
              type="button"
              class="muk-pg-btn muk-pg-prev"
              [disabled]="isFirst()"
              (click)="goTo(page - 1)"
              [attr.aria-label]="'Previous page'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              @if (variant !== 'minimal' && !compactMode()) {
                <span class="muk-pg-btn-label">Prev</span>
              }
            </button>
          </li>

          @if (variant !== 'minimal') {
            <!-- PAGE NUMBERS -->
            @for (p of pageNumbers(); track $index) {
              <li>
                @if (p === -1) {
                  <span class="muk-pg-ellipsis">…</span>
                } @else {
                  <button
                    type="button"
                    class="muk-pg-btn muk-pg-num"
                    [class.is-active]="p === page"
                    (click)="goTo(p)"
                    [attr.aria-label]="'Page ' + p"
                    [attr.aria-current]="p === page ? 'page' : null"
                  >{{ p }}</button>
                }
              </li>
            }
          } @else {
            <!-- Minimal - just "5 / 20" -->
            <li>
              <span class="muk-pg-current">
                {{ page }} / {{ totalPages() }}
              </span>
            </li>
          }

          <li>
            <button
              type="button"
              class="muk-pg-btn muk-pg-next"
              [disabled]="isLast()"
              (click)="goTo(page + 1)"
              [attr.aria-label]="'Next page'"
            >
              @if (variant !== 'minimal' && !compactMode()) {
                <span class="muk-pg-btn-label">Next</span>
              }
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </li>

          @if (showFirstLast) {
            <li>
              <button
                type="button"
                class="muk-pg-btn muk-pg-jump"
                [disabled]="isLast()"
                (click)="goTo(totalPages())"
                [attr.aria-label]="'Last page'"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="13 17 18 12 13 7"/>
                  <polyline points="6 17 11 12 6 7"/>
                </svg>
              </button>
            </li>
          }
        </ul>
      </nav>
    </div>
  `,
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
    // ── INPUTS ──

    /** Total number of items. */
    @Input() totalItems = 0;

    /** Current page (1-indexed). Two-way bound. */
    @Input() set page(v: number) { this._page = Math.max(1, v || 1); }
    get page(): number { return Math.min(this._page, this.totalPages() || 1); }
    private _page = 1;

    /** Items per page. Two-way bound. */
    @Input() pageSize = 10;

    /** Available page sizes. */
    @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

    /** Number of pages to show around current (siblings). */
    @Input() siblingCount = 1;

    /** Pages to show at start/end. */
    @Input() boundaryCount = 1;

    @Input() size: MukPaginationSize = 'md';
    @Input() variant: MukPaginationVariant = 'default';

    @Input() showInfo = true;
    @Input() showPageSize = true;
    @Input() showFirstLast = true;

    @Input() pageSizeLabel = 'Per page';

    /** Auto-compact below this px width. */
    @Input() compactBreakpoint = 480;


    // ── OUTPUTS ──

    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();


    // ── COMPUTED ──

    readonly totalPages = computed(() => {
        if (!this.totalItems || !this.pageSize) return 1;
        return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    });

    readonly compactMode = signal(false);

    readonly infoText = computed(() => {
        const total = this.totalItems;
        if (total === 0) return 'No items';
        const start = (this.page - 1) * this.pageSize + 1;
        const end = Math.min(start + this.pageSize - 1, total);
        return `${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()}`;
    });

    /**
     * Build page-number array.
     * Uses -1 as marker for ellipsis.
     * Example for 20 pages, current=10:  [1, -1, 9, 10, 11, -1, 20]
     */
    readonly pageNumbers = computed(() => {
        const total = this.totalPages();
        const current = this.page;
        const sib = this.siblingCount;
        const boundary = this.boundaryCount;

        // Max items shown: boundary*2 + sib*2 + 3 (current + 2 ellipsis)
        const maxItems = boundary * 2 + sib * 2 + 3;
        if (total <= maxItems) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        const result: number[] = [];

        // Left boundary
        for (let i = 1; i <= boundary; i++) result.push(i);

        // Left ellipsis
        const leftSibStart = Math.max(current - sib, boundary + 1);
        const rightSibEnd = Math.min(current + sib, total - boundary);

        if (leftSibStart > boundary + 1) {
            result.push(-1); // ellipsis
        } else {
            for (let i = boundary + 1; i < leftSibStart; i++) result.push(i);
        }

        // Sibling range
        for (let i = leftSibStart; i <= rightSibEnd; i++) result.push(i);

        // Right ellipsis
        if (rightSibEnd < total - boundary) {
            result.push(-1);
        } else {
            for (let i = rightSibEnd + 1; i <= total - boundary; i++) result.push(i);
        }

        // Right boundary
        for (let i = total - boundary + 1; i <= total; i++) result.push(i);

        return result;
    });

    isFirst(): boolean { return this.page <= 1; }
    isLast(): boolean { return this.page >= this.totalPages(); }


    // ── ACTIONS ──

    goTo(p: number): void {
        const clamped = Math.max(1, Math.min(this.totalPages(), p));
        if (clamped === this._page) return;
        this._page = clamped;
        this.pageChange.emit(clamped);
    }

    onPageSizeChange(event: Event): void {
        const newSize = Number((event.target as HTMLSelectElement).value);
        if (!newSize || newSize === this.pageSize) return;
        // When page size changes, try to keep showing the same first item
        const firstItem = (this.page - 1) * this.pageSize + 1;
        this.pageSize = newSize;
        this.pageSizeChange.emit(newSize);
        // Recalculate current page
        const newPage = Math.max(1, Math.ceil(firstItem / newSize));
        if (newPage !== this._page) {
            this._page = newPage;
            this.pageChange.emit(newPage);
        }
    }


    get hostClasses(): Record<string, boolean> {
        return {
            'muk-pg': true,
            [`muk-pg-size-${this.size}`]: true,
            [`muk-pg-variant-${this.variant}`]: true,
        };
    }
}