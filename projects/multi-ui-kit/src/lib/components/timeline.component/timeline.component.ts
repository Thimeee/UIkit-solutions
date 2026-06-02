import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukTimelineVariant = 'default' | 'filled' | 'outline' | 'minimal';
export type MukTimelineSize = 'sm' | 'md' | 'lg';
export type MukTimelineAlign = 'left' | 'alternate' | 'right';
export type MukTimelineConnector = 'solid' | 'dashed' | 'dotted';
export type MukTimelineMarkerColor =
  | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/**
 * A single timeline item inside <muk-timeline>.
 *
 *   <muk-timeline-item
 *     title="Order placed"
 *     time="10:30 AM"
 *     color="success"
 *     icon="bi bi-check-circle"
 *   >
 *     Order #12345 placed successfully.
 *   </muk-timeline-item>
 */
@Component({
  selector: 'muk-timeline-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
    <ng-template #leftContent>
      <ng-content select="[slot=left]"></ng-content>
    </ng-template>
  `,
})
export class TimelineItemComponent {
  /** Optional title (string). Or use the default slot. */
  @Input() title?: string;

  /** Optional timestamp/subtitle text. */
  @Input() time?: string;

  /** Marker color. */
  @Input() color: MukTimelineMarkerColor = 'primary';

  /** Optional icon class for the marker (e.g. 'bi bi-check'). */
  @Input() icon?: string;

  /** Mark as completed (filled marker). */
  @Input() completed = false;

  /** Pulse animation on the marker (for "active" event). */
  @Input() pulse = false;

  /** Content template (default body). */
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;

  /** Left-side template (for alternate alignment). */
  @ViewChild('leftContent', { static: true }) leftContent!: TemplateRef<any>;
}


/**
 * MUK Timeline - activity/event history.
 *
 * Use cases: audit trails, transaction history, activity feeds, order tracking.
 *
 * ── USAGE ──
 *
 *   <muk-timeline>
 *     <muk-timeline-item title="Order placed" time="10:30 AM" color="success">
 *       Order #12345 confirmed.
 *     </muk-timeline-item>
 *     <muk-timeline-item title="Shipped" time="2 days ago" color="info">
 *       Package on the way.
 *     </muk-timeline-item>
 *     <muk-timeline-item title="Delivered" time="Today" color="success" [completed]="true">
 *       Package received.
 *     </muk-timeline-item>
 *   </muk-timeline>
 *
 * Variants:
 *   <muk-timeline variant="filled">    filled markers
 *   <muk-timeline variant="outline">   outlined markers
 *   <muk-timeline variant="minimal">   small dots, no border
 *
 * Alignment:
 *   <muk-timeline align="left">       (default)
 *   <muk-timeline align="alternate">  zig-zag
 *   <muk-timeline align="right">      right side
 *
 * Connector style:
 *   <muk-timeline connector="solid">  (default)
 *   <muk-timeline connector="dashed">
 *   <muk-timeline connector="dotted">
 *
 * Alternate alignment with left-side content (slot):
 *   <muk-timeline-item title="Event">
 *     <span slot="left">10:30 AM · Office</span>
 *     Event details on the right side.
 *   </muk-timeline-item>
 */
@Component({
  selector: 'muk-timeline',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngClass]="hostClasses">
      @for (item of items; track $index; let i = $index; let last = $last) {
        <div
          class="muk-tl-item"
          [class.is-alt-right]="isAltRight(i)"
          [class.is-completed]="item.completed"
        >
          <!-- LEFT (only for alternate alignment) -->
          @if (align === 'alternate') {
            <div class="muk-tl-side muk-tl-side-left">
              <ng-container *ngTemplateOutlet="item.leftContent"></ng-container>
            </div>
          }

          <!-- MARKER COLUMN -->
          <div class="muk-tl-marker-col">
            <span
              class="muk-tl-marker"
              [ngClass]="markerClasses(item)"
              [class.is-pulse]="item.pulse"
            >
              @if (item.icon) {
                <i [class]="item.icon"></i>
              } @else if (item.completed) {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              }
              @if (item.pulse) {
                <span class="muk-tl-pulse-ring"></span>
              }
            </span>
            @if (!last) {
              <span class="muk-tl-connector"></span>
            }
          </div>

          <!-- BODY -->
          <div class="muk-tl-body">
            @if (item.title || item.time) {
              <div class="muk-tl-head">
                @if (item.title) {
                  <span class="muk-tl-title">{{ item.title }}</span>
                }
                @if (item.time) {
                  <span class="muk-tl-time">{{ item.time }}</span>
                }
              </div>
            }
            <div class="muk-tl-content">
              <ng-container *ngTemplateOutlet="item.content"></ng-container>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  @Input() variant: MukTimelineVariant = 'default';
  @Input() size: MukTimelineSize = 'md';
  @Input() align: MukTimelineAlign = 'left';
  @Input() connector: MukTimelineConnector = 'solid';

  @ContentChildren(TimelineItemComponent) itemsQuery!: QueryList<TimelineItemComponent>;

  get items(): TimelineItemComponent[] {
    return this.itemsQuery ? this.itemsQuery.toArray() : [];
  }

  isAltRight(i: number): boolean {
    return this.align === 'alternate' && i % 2 === 1;
  }

  markerClasses(item: TimelineItemComponent): Record<string, boolean> {
    return {
      [`muk-tl-marker-${item.color}`]: true,
      'is-completed': item.completed,
      'has-icon': !!item.icon,
    };
  }

  get hostClasses(): Record<string, boolean> {
    return {
      'muk-tl': true,
      [`muk-tl-variant-${this.variant}`]: true,
      [`muk-tl-size-${this.size}`]: true,
      [`muk-tl-align-${this.align}`]: true,
      [`muk-tl-conn-${this.connector}`]: true,
    };
  }
}