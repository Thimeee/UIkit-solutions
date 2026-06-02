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

export type MukStepperOrientation = 'horizontal' | 'vertical';
export type MukStepperVariant = 'default' | 'filled' | 'outline';
export type MukStepperSize = 'sm' | 'md' | 'lg';
export type MukStepperConnector = 'line' | 'dashed' | 'arrow' | 'none';

/**
 * A single step inside <muk-stepper>.
 *
 *   <muk-step label="Account" icon="bi bi-person" description="Your info">
 *     Step content here
 *   </muk-step>
 */
@Component({
    selector: 'muk-step',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class StepComponent {
    @Input() label?: string;
    @Input() description?: string;
    @Input() icon?: string;

    /** Mark as completed manually (overrides auto). */
    @Input() completed?: boolean;

    /** Mark as having an error. */
    @Input() error = false;

    /** Optional - allows clicking this step header to jump. */
    @Input() clickable = true;

    /** Disable this step. */
    @Input() disabled = false;

    @ViewChild('content', { static: true }) content!: TemplateRef<any>;
}


/**
 * MUK Stepper - multi-step wizard / progress flow.
 *
 * ── USAGE ──
 *
 * Basic:
 *   <muk-stepper [(activeIndex)]="step">
 *     <muk-step label="Account" icon="bi bi-person">Account form</muk-step>
 *     <muk-step label="Address" icon="bi bi-geo">Address form</muk-step>
 *     <muk-step label="Review">Review summary</muk-step>
 *   </muk-stepper>
 *
 * Vertical:
 *   <muk-stepper orientation="vertical">...</muk-stepper>
 *
 * Variants:
 *   <muk-stepper variant="filled">  - filled circles
 *   <muk-stepper variant="outline"> - outlined circles
 *   <muk-stepper variant="default"> - filled when active/done
 *
 * Linear mode (must complete in order):
 *   <muk-stepper [linear]="true">
 *
 * Error state on a step:
 *   <muk-step [error]="true" label="Payment">...</muk-step>
 *
 * Navigation:
 *   <muk-button (clicked)="stepper.next()">Next</muk-button>
 *   <muk-button (clicked)="stepper.prev()">Back</muk-button>
 */
@Component({
    selector: 'muk-stepper',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div [ngClass]="hostClasses">
      <!-- ── HEADER (steps row/column) ── -->
      <div class="muk-step-header" [attr.aria-orientation]="orientation">
        @for (step of steps; track $index; let i = $index; let last = $last) {
          <div
            class="muk-step"
            [class.is-active]="i === currentIndex()"
            [class.is-completed]="isCompleted(i)"
            [class.is-error]="step.error"
            [class.is-disabled]="step.disabled || isLocked(i)"
            [class.is-clickable]="canClick(step, i)"
            [attr.role]="canClick(step, i) ? 'button' : null"
            [attr.tabindex]="canClick(step, i) ? 0 : -1"
            [attr.aria-current]="i === currentIndex() ? 'step' : null"
            (click)="goTo(i)"
            (keydown.enter)="goTo(i)"
          >
            <div class="muk-step-marker">
              <span class="muk-step-circle">
                @if (isCompleted(i) && !step.error) {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                } @else if (step.error) {
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                } @else if (step.icon) {
                  <i [class]="step.icon"></i>
                } @else {
                  <span class="muk-step-num">{{ i + 1 }}</span>
                }
              </span>
            </div>

            <div class="muk-step-text">
              <div class="muk-step-label">{{ step.label }}</div>
              @if (step.description) {
                <div class="muk-step-desc">{{ step.description }}</div>
              }
            </div>

            @if (!last) {
              <div class="muk-step-connector" [class.is-completed]="isCompleted(i)"></div>
            }
          </div>
        }
      </div>

      <!-- ── BODY (active step content) ── -->
      <div class="muk-step-body">
        @if (steps.length && steps[currentIndex()]) {
          <ng-container *ngTemplateOutlet="steps[currentIndex()].content"></ng-container>
        }
      </div>
    </div>
  `,
    styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements AfterContentInit, OnDestroy {
    @Input() orientation: MukStepperOrientation = 'horizontal';
    @Input() variant: MukStepperVariant = 'default';
    @Input() size: MukStepperSize = 'md';
    @Input() connector: MukStepperConnector = 'line';

    /** Linear mode - user can only go to current or already-completed steps. */
    @Input() linear = false;

    /** Hide labels (only show circles + connectors). */
    @Input() iconsOnly = false;


    // ── ACTIVE INDEX (two-way) ──

    @Input() set activeIndex(v: number) {
        if (v === undefined || v === null) return;
        if (v !== this.currentIndex()) this.currentIndex.set(Math.max(0, v));
    }
    get activeIndex(): number { return this.currentIndex(); }

    @Output() activeIndexChange = new EventEmitter<number>();
    @Output() stepChange = new EventEmitter<number>();


    // ── STATE ──

    readonly currentIndex = signal(0);
    steps: StepComponent[] = [];

    @ContentChildren(StepComponent) stepsQuery!: QueryList<StepComponent>;

    private sub?: Subscription;

    constructor(private cdr: ChangeDetectorRef) { }

    ngAfterContentInit(): void {
        this.steps = this.stepsQuery.toArray();
        this.sub = this.stepsQuery.changes.subscribe(() => {
            this.steps = this.stepsQuery.toArray();
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }


    // ── PUBLIC API ──

    /** Move to the next step. Returns true on success. */
    next(): boolean {
        const n = this.currentIndex() + 1;
        if (n >= this.steps.length) return false;
        if (this.steps[n].disabled) return false;
        this.setIndex(n);
        return true;
    }

    /** Move to the previous step. */
    prev(): boolean {
        const n = this.currentIndex() - 1;
        if (n < 0) return false;
        this.setIndex(n);
        return true;
    }

    /** Reset to step 0. */
    reset(): void {
        this.setIndex(0);
    }

    /** Jump to specific index (if allowed). */
    goTo(index: number): void {
        if (!this.canClick(this.steps[index], index)) return;
        this.setIndex(index);
    }


    // ── INTERNAL ──

    private setIndex(i: number): void {
        if (i === this.currentIndex()) return;
        this.currentIndex.set(i);
        this.activeIndexChange.emit(i);
        this.stepChange.emit(i);
        this.cdr.markForCheck();
    }

    isCompleted(i: number): boolean {
        const step = this.steps[i];
        if (step?.completed !== undefined) return step.completed;
        return i < this.currentIndex();
    }

    /** Linear mode locks future steps. */
    isLocked(i: number): boolean {
        if (!this.linear) return false;
        return i > this.currentIndex();
    }

    canClick(step: StepComponent | undefined, i: number): boolean {
        if (!step) return false;
        if (step.disabled || !step.clickable) return false;
        if (this.isLocked(i)) return false;
        return true;
    }


    // ── COMPUTED ──

    get hostClasses(): Record<string, boolean> {
        return {
            'muk-stepper': true,
            [`muk-stepper-orient-${this.orientation}`]: true,
            [`muk-stepper-variant-${this.variant}`]: true,
            [`muk-stepper-size-${this.size}`]: true,
            [`muk-stepper-conn-${this.connector}`]: true,
            'is-icons-only': this.iconsOnly,
        };
    }
}