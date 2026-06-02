import {
    Component,
    inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ButtonComponent, MukButtonStyle, MukButtonVariant } from '../button.component/button.component';
import { DialogService, MukDialogState } from './dialog.service';

/**
 * MUK Dialog Host - renders programmatic confirm/alert dialogs.
 *
 * Place ONCE at the app root:
 *   <muk-dialog-host></muk-dialog-host>
 *
 * Then use DialogService anywhere:
 *   await this.dialog.confirm({ message: 'Sure?' });
 */
@Component({
    selector: 'muk-dialog-host',
    standalone: true,
    imports: [CommonModule, ModalComponent, ButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    @for (d of dialogService.dialogs(); track d.id) {
      <muk-modal
        [open]="true"
        [position]="d.position"
        [animation]="d.animation"
        [size]="d.size"
        [staticBackdrop]="d.staticBackdrop"
        [showClose]="d.kind === 'alert' ? false : true"
        (closed)="onDismiss(d)"
      >
        @if (d.title) {
          <span slot="title">{{ d.title }}</span>
        }

        <p class="muk-dialog-message">{{ d.message }}</p>

        <div slot="footer" class="flex justify-end gap-3">
          @if (d.kind === 'confirm') {
            <!-- Cancel: neutral so it never competes with the primary action -->
            <muk-button
              variant="secondary"
              buttonStyle="ghost"
              size="sm"
            [hoverLift]="false"

              (clicked)="resolve(d, false)"
            >
              {{ d.cancelText }}
            </muk-button>
          }
          <!-- Confirm: uses the dialog's variant + chosen style -->
          <muk-button
            [variant]="buttonVariant(d.variant)"
            [buttonStyle]="buttonStyle(d.style)"
            [gradient]="false"
            [hoverLift]="false"
            size="sm"
            (clicked)="resolve(d, true)"
          >
            {{ d.confirmText }}
          </muk-button>
        </div>
      </muk-modal>
    }
  `,
    styles: [`
    .muk-dialog-message {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--muk-text);
    }
  `],
})
export class DialogHostComponent {
    dialogService = inject(DialogService);

    /** Map alert variant to button variant (they share names). */
    buttonVariant(variant: string): MukButtonVariant {
        return variant as MukButtonVariant;
    }

    /** Map dialog style to button style. */
    buttonStyle(style: string): MukButtonStyle {
        return style as MukButtonStyle;
    }

    resolve(dialog: MukDialogState, result: boolean): void {
        this.dialogService.resolve(dialog.id, result);
    }

    /** Backdrop/ESC/X close = cancel (false). */
    onDismiss(dialog: MukDialogState): void {
        // If still in the list (not already resolved by a button), resolve false
        const stillOpen = this.dialogService.dialogs().some(d => d.id === dialog.id);
        if (stillOpen) {
            this.dialogService.resolve(dialog.id, false);
        }
    }
}