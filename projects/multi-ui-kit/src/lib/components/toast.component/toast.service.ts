import { Injectable, signal } from '@angular/core';
import type { MukAlertVariant, MukAlertStyle } from '../alert.component/alert.component';

/**
 * Toast position on the screen.
 */
export type MukToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

/**
 * Toast entrance animation (the toast slides IN from this direction).
 * - from-left   : starts off-screen left, slides right into place
 * - from-right  : starts off-screen right, slides left into place
 * - from-bottom : starts below, slides up into place
 * - from-top    : starts above, slides down into place
 * - fade        : fades in/out in place (no movement)
 */
export type MukToastAnimation =
    | 'from-left'
    | 'from-right'
    | 'from-bottom'
    | 'from-top'
    | 'fade';

/**
 * Options for showing a toast.
 */
export interface MukToastOptions {
    /** Message body text. */
    message: string;
    /** Optional bold title. */
    title?: string;
    /** Color variant. */
    variant?: MukAlertVariant;
    /** Visual style. */
    style?: MukAlertStyle;
    /** Where on screen to show. Default 'top-right'. */
    position?: MukToastPosition;
    /** Entry/exit animation. Default auto (based on position). */
    animation?: MukToastAnimation;
    /** Auto-dismiss after N ms. 0 = stays until dismissed. Default 4000. */
    duration?: number;
    /** Show countdown progress bar. Default true. */
    showProgress?: boolean;
    /** Show close (X) button. Default true. */
    dismissible?: boolean;
    /** Show the variant icon. Default true. */
    showIcon?: boolean;
}

/**
 * A live toast instance (internal).
 */
export interface MukToast {
    id: number;
    message: string;
    title?: string;
    variant: MukAlertVariant;
    style: MukAlertStyle;
    position: MukToastPosition;
    animation: MukToastAnimation;
    duration: number;
    showProgress: boolean;
    dismissible: boolean;
    showIcon: boolean;
}

/**
 * MUK Toast Service - programmatic, real-world toast notifications.
 *
 * Setup: place ONE container at app root:
 *   <muk-toast-container></muk-toast-container>
 *
 * ── USAGE ──
 *
 *   constructor(private toast: ToastService) {}
 *
 *   // Shorthand helpers
 *   this.toast.success('Saved successfully!');
 *   this.toast.error('Something went wrong');
 *   this.toast.warning('Please review');
 *   this.toast.info('New update available');
 *
 *   // With options
 *   this.toast.success('Saved!', {
 *     title: 'Done',
 *     position: 'bottom-center',
 *     animation: 'slide-up',
 *     duration: 5000,
 *   });
 *
 *   // Full control
 *   this.toast.show({
 *     message: 'Custom toast',
 *     variant: 'primary',
 *     position: 'top-left',
 *     animation: 'slide-right',
 *     duration: 0,            // stays until dismissed
 *   });
 *
 *   // Dismiss all
 *   this.toast.clear();
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
    /** All active toasts (read by the container component). */
    readonly toasts = signal<MukToast[]>([]);

    private counter = 0;

    // Defaults
    private defaults: Required<Omit<MukToastOptions, 'message' | 'title' | 'animation'>> = {
        variant: 'info',
        style: 'soft',
        position: 'top-right',
        duration: 4000,
        showProgress: true,
        dismissible: true,
        showIcon: true,
    };

    /**
     * Show a toast with full options.
     * @returns the toast id (use with dismiss(id))
     */
    show(opts: MukToastOptions): number {
        const id = ++this.counter;
        const position = opts.position ?? this.defaults.position;

        const toast: MukToast = {
            id,
            message: opts.message,
            title: opts.title,
            variant: opts.variant ?? this.defaults.variant,
            style: opts.style ?? this.defaults.style,
            position,
            animation: opts.animation ?? this.defaultAnimation(position),
            duration: opts.duration ?? this.defaults.duration,
            showProgress: opts.showProgress ?? this.defaults.showProgress,
            dismissible: opts.dismissible ?? this.defaults.dismissible,
            showIcon: opts.showIcon ?? this.defaults.showIcon,
        };

        this.toasts.update(list => [...list, toast]);
        return id;
    }

    /** Dismiss a specific toast by id. */
    dismiss(id: number): void {
        this.toasts.update(list => list.filter(t => t.id !== id));
    }

    /** Dismiss all toasts. */
    clear(): void {
        this.toasts.set([]);
    }

    // ── SHORTHAND HELPERS ──

    success(message: string, opts: Partial<MukToastOptions> = {}): number {
        return this.show({ ...opts, message, variant: 'success' });
    }

    error(message: string, opts: Partial<MukToastOptions> = {}): number {
        return this.show({ ...opts, message, variant: 'danger' });
    }

    warning(message: string, opts: Partial<MukToastOptions> = {}): number {
        return this.show({ ...opts, message, variant: 'warning' });
    }

    info(message: string, opts: Partial<MukToastOptions> = {}): number {
        return this.show({ ...opts, message, variant: 'info' });
    }

    /** Set new global defaults (call once at app start if desired). */
    configure(defaults: Partial<typeof this.defaults>): void {
        this.defaults = { ...this.defaults, ...defaults };
    }

    /**
     * Pick a sensible default animation based on position.
     * Left positions slide from left, right from right, center fades.
     */
    private defaultAnimation(position: MukToastPosition): MukToastAnimation {
        if (position.endsWith('left')) return 'from-left';     // enters from left edge
        if (position.endsWith('right')) return 'from-right';   // enters from right edge
        if (position.startsWith('top')) return 'from-top';     // top-center drops down
        return 'from-bottom';                                  // bottom-center rises up
    }
}