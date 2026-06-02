import {
    Component,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukSkeletonVariant = 'text' | 'rect' | 'circle' | 'rounded';
export type MukSkeletonAnimation = 'pulse' | 'wave' | 'none';

/**
 * MUK Skeleton - loading placeholder for content.
 *
 * Better UX than spinners for "content shape" loading (cards, lists, articles).
 *
 * ── USAGE ──
 *
 * Single shapes:
 *   <muk-skeleton variant="text" width="80%"></muk-skeleton>
 *   <muk-skeleton variant="circle" width="48px" height="48px"></muk-skeleton>
 *   <muk-skeleton variant="rect" width="100%" height="200px"></muk-skeleton>
 *
 * Multiple text lines:
 *   <muk-skeleton variant="text" [lines]="3"></muk-skeleton>
 *
 * Animations: pulse (default), wave, none
 *   <muk-skeleton animation="wave"></muk-skeleton>
 *
 * Card-style composition:
 *   <div>
 *     <muk-skeleton variant="rect" height="200px"></muk-skeleton>
 *     <muk-skeleton variant="text" width="60%" style="margin-top: 12px"></muk-skeleton>
 *     <muk-skeleton variant="text" [lines]="2" style="margin-top: 8px"></muk-skeleton>
 *   </div>
 */
@Component({
    selector: 'muk-skeleton',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    @if (variant === 'text' && lines > 1) {
      <div class="muk-skel-lines" [ngClass]="containerClasses">
        @for (line of linesArray; track $index; let last = $last) {
          <span
            class="muk-skel"
            [ngClass]="hostClasses"
            [style.width]="last ? lastLineWidth : (width || '100%')"
            [style.height]="height || null"
          ></span>
        }
      </div>
    } @else {
      <span
        class="muk-skel"
        [ngClass]="hostClasses"
        [style.width]="width || null"
        [style.height]="height || null"
      ></span>
    }
  `,
    styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent {
    @Input() variant: MukSkeletonVariant = 'text';
    @Input() animation: MukSkeletonAnimation = 'pulse';

    /** Width (e.g. '100%', '200px', '60%'). */
    @Input() width?: string;

    /** Height (e.g. '20px', '200px'). */
    @Input() height?: string;

    /** Number of text lines (text variant only). Default 1. */
    @Input() lines = 1;

    /** Width of the LAST line (e.g. '60%' to make it look like real paragraph). */
    @Input() lastLineWidth = '70%';

    get linesArray(): number[] {
        return Array.from({ length: this.lines }, (_, i) => i);
    }

    get hostClasses(): Record<string, boolean> {
        return {
            [`muk-skel-${this.variant}`]: true,
            [`muk-skel-anim-${this.animation}`]: this.animation !== 'none',
        };
    }

    get containerClasses(): Record<string, boolean> {
        return {
            [`muk-skel-lines-${this.variant}`]: true,
        };
    }
}