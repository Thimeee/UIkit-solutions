import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    AfterContentInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Alert color variant (semantic).
 */
export type MukAlertVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';

/**
 * Alert visual style.
 * - soft     : tinted background (default - subtle, most common)
 * - solid    : filled colored background
 * - outline  : transparent with colored border
 * - left-accent : surface bg with a colored left bar
 */
export type MukAlertStyle = 'soft' | 'solid' | 'outline' | 'left-accent';

/**
 * Alert size.
 */
export type MukAlertSize = 'sm' | 'md' | 'lg';

/**
 * MUK Alert Component - production-grade contextual feedback banner.
 *
 * Features:
 *  - 6 semantic variants × 4 styles
 *  - Default icons per variant (override-able via slot)
 *  - Dismissible with smooth collapse animation
 *  - Auto-dismiss with optional progress bar
 *  - Title + body content via projection
 *  - Action buttons slot
 *  - Theme-aware (light/dark)
 *  - Accessible (role=alert, aria-live)
 *
 * ── USAGE ──
 *
 * Basic:
 *   <muk-alert variant="success">Saved successfully!</muk-alert>
 *
 * With title:
 *   <muk-alert variant="warning" title="Heads up">
 *     Your subscription expires soon.
 *   </muk-alert>
 *
 * Dismissible:
 *   <muk-alert variant="danger" [dismissible]="true" (dismissed)="onDismiss()">
 *     Something went wrong.
 *   </muk-alert>
 *
 * Auto-dismiss (toast-like):
 *   <muk-alert variant="info" [autoDismiss]="4000" [showProgress]="true">
 *     Copied to clipboard
 *   </muk-alert>
 *
 * Custom icon (any icon library):
 *   <muk-alert variant="success">
 *     <i slot="icon" class="fa fa-check-circle"></i>
 *     Done!
 *   </muk-alert>
 *
 * No icon:
 *   <muk-alert variant="info" [showIcon]="false">Simple message</muk-alert>
 *
 * With actions:
 *   <muk-alert variant="warning" title="Unsaved changes">
 *     You have unsaved changes.
 *     <div slot="actions">
 *       <muk-button size="sm" variant="warning">Save</muk-button>
 *       <muk-button size="sm" buttonStyle="ghost">Discard</muk-button>
 *     </div>
 *   </muk-alert>
 *
 * Different styles:
 *   <muk-alert variant="success" alertStyle="solid">Filled</muk-alert>
 *   <muk-alert variant="danger" alertStyle="outline">Bordered</muk-alert>
 *   <muk-alert variant="info" alertStyle="left-accent">Accent bar</muk-alert>
 */
@Component({
    selector: 'muk-alert',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent implements OnInit, AfterContentInit, OnDestroy {
    // ── APPEARANCE ──

    /** Color variant. Default `info`. */
    @Input() variant: MukAlertVariant = 'info';

    /** Visual style. Default `soft`. */
    @Input() alertStyle: MukAlertStyle = 'soft';

    /** Size. Default `md`. */
    @Input() size: MukAlertSize = 'md';

    /** Optional title (bold, above the body). */
    @Input() title?: string;


    // ── ICON ──

    /** Show the icon. Default true. */
    @Input() showIcon: boolean = true;


    // ── DISMISS ──

    /** Show a close (X) button. */
    @Input() dismissible: boolean = false;

    /**
     * Auto-dismiss after N milliseconds. 0 = disabled.
     * e.g. [autoDismiss]="4000" dismisses after 4 seconds.
     */
    @Input() autoDismiss: number = 0;

    /** Show a countdown progress bar when autoDismiss is active. */
    @Input() showProgress: boolean = false;


    // ── STYLE OPTIONS ──

    /** Rounded corners. Default true. */
    @Input() rounded: boolean = true;

    /** Subtle entrance animation. Default true. */
    @Input() animate: boolean = true;


    // ── EVENTS ──

    /** Emitted when the alert is dismissed (by button or auto-dismiss). */
    @Output() dismissed = new EventEmitter<void>();


    // ── STATE ──

    visible = true;
    leaving = false;
    hasCustomIcon = false;
    hasActions = false;

    private autoDismissTimer?: ReturnType<typeof setTimeout>;

    readonly alertId = `muk-alert-${Math.random().toString(36).substring(2, 10)}`;


    constructor(
        private host: ElementRef<HTMLElement>,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {
        if (this.autoDismiss > 0) {
            this.autoDismissTimer = setTimeout(() => {
                this.dismiss();
            }, this.autoDismiss);
        }
    }

    ngAfterContentInit(): void {
        queueMicrotask(() => {
            const el = this.host.nativeElement;
            this.hasCustomIcon = !!el.querySelector('[slot="icon"]');
            this.hasActions = !!el.querySelector('[slot="actions"]');
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        if (this.autoDismissTimer) {
            clearTimeout(this.autoDismissTimer);
        }
    }


    // ── COMPUTED ──

    get hostClasses(): Record<string, boolean> {
        return {
            'muk-alert': true,
            [`muk-alert-${this.alertStyle}`]: true,
            [`muk-alert-${this.variant}`]: true,
            [`muk-alert-size-${this.size}`]: true,
            'is-rounded': this.rounded,
            'is-animated': this.animate,
            'is-leaving': this.leaving,
            'has-title': !!this.title,
            'has-progress': this.showProgress && this.autoDismiss > 0,
        };
    }

    /** ARIA role - assertive for errors, polite otherwise. */
    get ariaRole(): string {
        return this.variant === 'danger' ? 'alert' : 'status';
    }

    get ariaLive(): string {
        return this.variant === 'danger' ? 'assertive' : 'polite';
    }

    /** Progress bar animation duration in ms. */
    get progressDuration(): string {
        return `${this.autoDismiss}ms`;
    }


    // ── ACTIONS ──

    dismiss(): void {
        if (this.autoDismissTimer) {
            clearTimeout(this.autoDismissTimer);
        }

        if (this.animate) {
            // Play leave animation, then remove
            this.leaving = true;
            this.cdr.markForCheck();
            setTimeout(() => {
                this.visible = false;
                this.dismissed.emit();
                this.cdr.markForCheck();
            }, 250);
        } else {
            this.visible = false;
            this.dismissed.emit();
            this.cdr.markForCheck();
        }
    }
}