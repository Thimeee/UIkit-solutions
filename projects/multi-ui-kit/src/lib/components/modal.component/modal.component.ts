import {
    Component,
    Input,
    Output,
    EventEmitter,
    HostListener,
    ElementRef,
    AfterContentInit,
    OnDestroy,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

/**
 * Modal position.
 * - center : classic centered dialog
 * - top / bottom / left / right : edge drawers (slide-in panels)
 */
export type MukModalPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

/**
 * Modal entrance animation.
 * - zoom  : scale up from center
 * - fade  : fade in place
 * - slide : slide in from the position's edge (default for drawers)
 */
export type MukModalAnimation = 'zoom' | 'fade' | 'slide';

/**
 * Modal size.
 * - center: controls max-width
 * - drawers: controls width (left/right) or height (top/bottom)
 */
export type MukModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * MUK Modal Component - flexible dialog / drawer.
 *
 * Two-way bound `open` controls visibility.
 *
 * ── USAGE ──
 *
 * Center modal:
 *   <muk-modal [(open)]="show" position="center" size="md">
 *     <span slot="title">Edit Profile</span>
 *     <p>Body content here.</p>
 *     <div slot="footer">
 *       <muk-button (clicked)="show = false">Close</muk-button>
 *     </div>
 *   </muk-modal>
 *
 * Drawer (slides from right):
 *   <muk-modal [(open)]="show" position="right" size="md">
 *     <span slot="title">Settings</span>
 *     ...
 *   </muk-modal>
 *
 * Static backdrop (won't close on outside click - for forms):
 *   <muk-modal [(open)]="show" [staticBackdrop]="true">...</muk-modal>
 */
@Component({
    selector: 'muk-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements AfterContentInit, OnDestroy {
    private document = inject(DOCUMENT);

    // ── VISIBILITY ──

    /** Two-way bound open state. <muk-modal [(open)]="show"> */
    @Input()
    get open(): boolean {
        return this._open;
    }
    set open(value: boolean) {
        if (value === this._open) return;
        this._open = value;
        if (value) {
            this.onOpen();
        } else {
            this.onClose();
        }
    }
    private _open = false;

    @Output() openChange = new EventEmitter<boolean>();


    // ── APPEARANCE ──

    /** Position. Default `center`. */
    @Input() position: MukModalPosition = 'center';

    /** Animation. Default auto (zoom for center, slide for drawers). */
    @Input() animation?: MukModalAnimation;

    /** Size. Default `md`. */
    @Input() size: MukModalSize = 'md';

    /** Optional title (alternative to [slot=title]). */
    @Input() title?: string;


    // ── BEHAVIOR ──

    /** Backdrop click won't close (use for forms). Default false. */
    @Input() staticBackdrop: boolean = false;

    /** ESC key closes the modal. Default true. */
    @Input() closeOnEsc: boolean = true;

    /** Show the X close button. Default true. */
    @Input() showClose: boolean = true;

    /** Show the backdrop scrim. Default true. */
    @Input() showBackdrop: boolean = true;

    /** Blur the backdrop. Default true. */
    @Input() blurBackdrop: boolean = true;

    /** Body content scrolls if too tall. Default true. */
    @Input() scrollable: boolean = true;

    /** Lock body scroll while open. Default true. */
    @Input() lockScroll: boolean = true;


    // ── EVENTS ──

    /** Emitted when the modal finishes opening. */
    @Output() opened = new EventEmitter<void>();

    /** Emitted when the modal is closed (any method). */
    @Output() closed = new EventEmitter<void>();

    /** Emitted when backdrop is clicked (even if static). */
    @Output() backdropClick = new EventEmitter<void>();


    // ── STATE ──

    leaving = false;
    hasTitle = false;
    hasFooter = false;

    readonly modalId = `muk-modal-${Math.random().toString(36).substring(2, 10)}`;

    private leaveTimer?: ReturnType<typeof setTimeout>;


    constructor(
        private host: ElementRef<HTMLElement>,
        private cdr: ChangeDetectorRef,
    ) { }

    ngAfterContentInit(): void {
        // If the modal is already open at init, detect slots now.
        if (this._open) {
            this.detectSlots();
        }
    }

    ngOnDestroy(): void {
        this.unlockBodyScroll();
        if (this.leaveTimer) clearTimeout(this.leaveTimer);
    }

    /**
     * Detect which projection slots are filled.
     * Must run AFTER the modal DOM is rendered (i.e. when open=true),
     * because <ng-content> only exists in the DOM while open.
     * setTimeout (not microtask) ensures the @if branch has rendered.
     */
    private detectSlots(): void {
        setTimeout(() => {
            const el = this.host.nativeElement;
            this.hasTitle = !!el.querySelector('[slot="title"]') || !!this.title;
            this.hasFooter = !!el.querySelector('[slot="footer"]');
            this.cdr.markForCheck();
        });
    }


    // ── COMPUTED ──

    /** Resolved animation (auto-picks based on position). */
    get resolvedAnimation(): MukModalAnimation {
        if (this.animation) return this.animation;
        return this.position === 'center' ? 'zoom' : 'slide';
    }

    get backdropClasses(): Record<string, boolean> {
        return {
            'muk-modal-backdrop': true,
            'is-leaving': this.leaving,
            'no-scrim': !this.showBackdrop,
            'has-blur': this.blurBackdrop && this.showBackdrop,
            [`pos-${this.position}`]: true,
        };
    }

    get dialogClasses(): Record<string, boolean> {
        return {
            'muk-modal-dialog': true,
            [`muk-modal-${this.position}`]: true,
            [`muk-modal-size-${this.size}`]: true,
            [`anim-${this.resolvedAnimation}`]: true,
            'is-leaving': this.leaving,
            'is-scrollable': this.scrollable,
        };
    }


    // ── ACTIONS ──

    onBackdropClick(): void {
        this.backdropClick.emit();
        if (!this.staticBackdrop) {
            this.close();
        }
    }

    close(): void {
        if (!this._open) return;
        // Play leave animation, then set open=false
        this.leaving = true;
        this.cdr.markForCheck();

        this.leaveTimer = setTimeout(() => {
            this.leaving = false;
            this._open = false;
            this.openChange.emit(false);
            this.closed.emit();
            this.unlockBodyScroll();
            this.cdr.markForCheck();
        }, 250);
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        if (this._open && this.closeOnEsc && !this.staticBackdrop) {
            this.close();
        }
    }


    // ── INTERNAL ──

    private onOpen(): void {
        this.openChange.emit(true);
        if (this.lockScroll) this.lockBodyScroll();
        // Detect slots now that the modal DOM is rendered
        this.detectSlots();
        // Emit opened after the open animation
        setTimeout(() => this.opened.emit(), 50);
        this.cdr.markForCheck();
    }

    private onClose(): void {
        this.unlockBodyScroll();
    }

    private lockBodyScroll(): void {
        this.document.body.style.overflow = 'hidden';
    }

    private unlockBodyScroll(): void {
        this.document.body.style.overflow = '';
    }
}