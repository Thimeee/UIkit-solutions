import {
    Injectable,
    signal,
    inject,
} from '@angular/core';
import type { MukAlertVariant } from '../alert.component/alert.component';
import type { MukModalPosition, MukModalAnimation, MukModalSize } from './modal.component';
import { MukButtonStyle } from '../button.component/button.component';

/**
 * Options for a confirm dialog.
 */
export interface MukConfirmOptions {
    /** Dialog title. */
    title?: string;
    /** Body message. */
    message: string;
    /** Confirm button text. Default 'Confirm'. */
    confirmText?: string;
    /** Cancel button text. Default 'Cancel'. */
    cancelText?: string;
    /** Variant - colors the confirm button & icon. Default 'primary'. */
    variant?: MukAlertVariant;

    style?: MukButtonStyle;
    /** Position. Default 'center'. */
    position?: MukModalPosition;
    /** Animation. */
    animation?: MukModalAnimation;
    /** Size. Default 'sm'. */
    size?: MukModalSize;
    /** Backdrop click won't dismiss. Default false. */
    staticBackdrop?: boolean;
}

/**
 * Options for an alert dialog (single OK button).
 */
export interface MukAlertDialogOptions {
    title?: string;
    message: string;
    /** OK button text. Default 'OK'. */
    okText?: string;
    variant?: MukAlertVariant;
    style?: MukButtonStyle;
    position?: MukModalPosition;
    animation?: MukModalAnimation;
    size?: MukModalSize;
}

/**
 * Internal dialog state (read by the host container).
 */
export interface MukDialogState {
    id: number;
    kind: 'confirm' | 'alert';
    title?: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant: MukAlertVariant;
    style: MukButtonStyle;
    position: MukModalPosition;
    animation?: MukModalAnimation;
    size: MukModalSize;
    staticBackdrop: boolean;
    resolve: (value: boolean) => void;
}

/**
 * MUK Dialog Service - programmatic confirm & alert dialogs.
 *
 * Setup: place ONE host at app root:
 *   <muk-dialog-host></muk-dialog-host>
 *
 * ── USAGE ──
 *
 *   constructor(private dialog: DialogService) {}
 *
 *   // Confirm (returns Promise<boolean>)
 *   async deleteItem() {
 *     const ok = await this.dialog.confirm({
 *       title: 'Delete item?',
 *       message: 'This action cannot be undone.',
 *       variant: 'danger',
 *       confirmText: 'Delete',
 *     });
 *     if (ok) { ...delete... }
 *   }
 *
 *   // Alert (single OK button)
 *   async showDone() {
 *     await this.dialog.alert({
 *       title: 'Success',
 *       message: 'Your changes were saved.',
 *       variant: 'success',
 *     });
 *   }
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
    /** Active dialogs (read by the host component). */
    readonly dialogs = signal<MukDialogState[]>([]);

    private counter = 0;

    /**
     * Show a confirm dialog. Resolves true (confirm) or false (cancel/dismiss).
     */
    confirm(opts: MukConfirmOptions): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const dialog: MukDialogState = {
                id: ++this.counter,
                kind: 'confirm',
                title: opts.title,
                message: opts.message,
                confirmText: opts.confirmText ?? 'Confirm',
                cancelText: opts.cancelText ?? 'Cancel',
                variant: opts.variant ?? 'primary',
                style: opts.style ?? 'solid',
                position: opts.position ?? 'center',
                animation: opts.animation,
                size: opts.size ?? 'sm',
                staticBackdrop: opts.staticBackdrop ?? false,
                resolve,
            };
            this.dialogs.update(list => [...list, dialog]);
        });
    }

    /**
     * Show an alert dialog (single OK). Resolves true when dismissed.
     */
    alert(opts: MukAlertDialogOptions): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const dialog: MukDialogState = {
                id: ++this.counter,
                kind: 'alert',
                title: opts.title,
                message: opts.message,
                confirmText: opts.okText ?? 'OK',
                cancelText: '',
                variant: opts.variant ?? 'info',
                style: opts.style ?? 'solid',
                position: opts.position ?? 'center',
                animation: opts.animation,
                size: opts.size ?? 'sm',
                staticBackdrop: false,
                resolve,
            };
            this.dialogs.update(list => [...list, dialog]);
        });
    }

    /** Resolve & remove a dialog (called by the host). */
    resolve(id: number, result: boolean): void {
        const dialog = this.dialogs().find(d => d.id === id);
        if (dialog) {
            dialog.resolve(result);
            this.dialogs.update(list => list.filter(d => d.id !== id));
        }
    }
}