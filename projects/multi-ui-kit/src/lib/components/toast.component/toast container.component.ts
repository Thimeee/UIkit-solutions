import {
  Component,
  inject,
  computed,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../alert.component/alert.component';
import { ToastService, MukToast, MukToastPosition } from './toast.service';

/**
 * MUK Toast Container - renders all active toasts at their positions.
 *
 * Place ONCE at the app root:
 *   <muk-toast-container></muk-toast-container>
 *
 * Then trigger from anywhere via ToastService:
 *   this.toast.success('Saved!');
 */
@Component({
  selector: 'muk-toast-container',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (pos of positions; track pos) {
      @if (byPosition()[pos]?.length) {
        <div class="muk-toast-region" [attr.data-position]="pos">
          @for (toast of byPosition()[pos]; track toast.id) {
            <div
              class="muk-toast-item"
              [attr.data-animation]="toast.animation"
              [class.is-leaving]="leaving().has(toast.id)"
            >
              <muk-alert
                [variant]="toast.variant"
                [alertStyle]="toast.style"
                [title]="toast.title"
                [showIcon]="toast.showIcon"
                [dismissible]="toast.dismissible"
                [autoDismiss]="toast.duration"
                [showProgress]="toast.showProgress"
                [animate]="false"
                (dismissed)="onDismiss(toast.id)"
              >
                {{ toast.message }}
              </muk-alert>
            </div>
          }
        </div>
      }
    }
  `,
  styleUrls: ['./toast-container.component.scss'],
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);

  readonly positions: MukToastPosition[] = [
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right',
  ];

  /** IDs currently playing the leave animation. */
  readonly leaving = signal<Set<number>>(new Set());

  /** Group toasts by position. */
  readonly byPosition = computed(() => {
    const groups: Record<string, MukToast[]> = {};
    for (const t of this.toastService.toasts()) {
      (groups[t.position] ??= []).push(t);
    }
    return groups;
  });

  onDismiss(id: number): void {
    // Mark as leaving → plays exit animation → then actually remove
    this.leaving.update(set => {
      const next = new Set(set);
      next.add(id);
      return next;
    });

    setTimeout(() => {
      this.toastService.dismiss(id);
      this.leaving.update(set => {
        const next = new Set(set);
        next.delete(id);
        return next;
      });
    }, 280); // match exit animation duration
  }
}