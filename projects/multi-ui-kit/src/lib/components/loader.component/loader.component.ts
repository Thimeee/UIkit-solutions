import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoaderService } from './loader.service';

/**
 * Loader visual type
 */
export type MukLoaderType = 'dots' | 'spinner' | 'pulse' | 'wave' | 'bars' | 'circle';

/**
 * Loader size variants
 */
export type MukLoaderSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Loader color theme.
 * - primary  : default for most use cases (matches theme)
 * - secondary: subtle / less prominent loading
 * - success  : after a successful action being processed
 * - warning  : slow or careful operation
 * - danger   : retry after error / dangerous operation
 * - info     : data fetching / informational
 * - dark     : neutral dark style, good on light overlays
 */
export type MukLoaderColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'dark';

/**
 * MUK Loader Component
 *
 * Usage patterns:
 *
 *  1) Page / route loading (full screen):
 *     <muk-loader [fullScreen]="true" message="Loading page"></muk-loader>
 *
 *  2) Component / card loading (overlay inside relative parent):
 *     <div class="position-relative">
 *       <muk-loader *ngIf="loading" [overlay]="true"></muk-loader>
 *       <!-- card content -->
 *     </div>
 *
 *  3) Inline (in a button or small section):
 *     <button><muk-loader [inline]="true" size="sm" [showMessage]="false"></muk-loader> Saving</button>
 *
 *  4) Service-driven global loader (anywhere - app.component.html):
 *     <muk-loader
 *       *ngIf="loaderService.isLoading$ | async"
 *       [fullScreen]="true"
 *       [message]="(loaderService.message$ | async) || 'Loading'">
 *     </muk-loader>
 *
 *     // or with auto-bind:
 *     <muk-loader autoBind [fullScreen]="true"></muk-loader>
 */
@Component({
  selector: 'muk-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {
  /** Visual style of the loader */
  @Input() type: MukLoaderType = 'dots';

  /** Size of the loader */
  @Input() size: MukLoaderSize = 'md';

  /** Color theme. Default `primary` matches the app theme. */
  @Input() color: MukLoaderColor = 'primary';

  /** Message shown under the loader animation */
  @Input() message: string = 'Loading';

  /** Show/hide the message text */
  @Input() showMessage: boolean = true;

  /** Render as a fixed full-screen page loader */
  @Input() fullScreen: boolean = false;

  /** Render as an absolute overlay inside a relatively-positioned parent */
  @Input() overlay: boolean = false;

  /** Render inline (e.g. inside a button); hides message by default */
  @Input() inline: boolean = false;

  /** Force-show the loader (when not using autoBind) */
  @Input() visible: boolean = true;

  /**
   * Auto-bind to the global LoaderService.
   * When true, visibility & message follow LoaderService.isLoading$ / message$.
   */
  @Input() autoBind: boolean = false;

  private loaderService = inject(LoaderService, { optional: true });
  private sub?: Subscription;

  /** Unique gradient ID to avoid SVG collisions on the same page */
  readonly gradientId = `muk-loader-gradient-${Math.random().toString(36).substring(2, 10)}`;

  ngOnInit(): void {
    if (this.autoBind && this.loaderService) {
      this.sub = this.loaderService.state$.subscribe((state) => {
        this.visible = state.loading;
        if (state.message) {
          this.message = state.message;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get sizeClass(): string {
    return `muk-loader-${this.size}`;
  }

  get colorClass(): string {
    return `muk-loader-${this.color}`;
  }

  get containerClasses(): string {
    const classes = ['muk-loader-container'];
    if (this.fullScreen) classes.push('muk-loader-fullscreen');
    if (this.overlay) classes.push('muk-loader-overlay');
    if (this.inline) classes.push('muk-loader-inline');
    return classes.join(' ');
  }
}
