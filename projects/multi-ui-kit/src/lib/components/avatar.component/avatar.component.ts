import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    computed,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type MukAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type MukAvatarShape = 'circle' | 'rounded' | 'square';
export type MukAvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';
export type MukAvatarColor =
    | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'auto';

/**
 * MUK Avatar - user profile image with auto initials fallback.
 *
 * ── USAGE ──
 *
 * Image:
 *   <muk-avatar src="/u.jpg" name="John Doe"></muk-avatar>
 *
 * Initials (no src):
 *   <muk-avatar name="John Doe"></muk-avatar>     → "JD"
 *
 * Icon fallback:
 *   <muk-avatar>
 *     <i slot="icon" class="bi bi-person"></i>
 *   </muk-avatar>
 *
 * Status badge:
 *   <muk-avatar name="John" status="online"></muk-avatar>
 *
 * Color (auto-picks from name, or set explicitly):
 *   <muk-avatar name="John Doe" color="auto"></muk-avatar>
 *   <muk-avatar name="John" color="success"></muk-avatar>
 *
 * Clickable:
 *   <muk-avatar name="John" [clickable]="true" (clicked)="openProfile()"></muk-avatar>
 *
 * Sizes: xs sm md lg xl 2xl
 * Shapes: circle (default), rounded, square
 */
@Component({
    selector: 'muk-avatar',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <span
      [ngClass]="hostClasses"
      [attr.role]="clickable ? 'button' : null"
      [attr.tabindex]="clickable ? 0 : null"
      [attr.aria-label]="ariaLabel || name || null"
      (click)="onClick($event)"
      (keydown.enter)="onClick($event)"
    >
      @if (src && !imageError()) {
        <img
          class="muk-av-img"
          [src]="src"
          [alt]="name || ''"
          (error)="imageError.set(true)"
          loading="lazy"
        />
      } @else if (hasIconSlot) {
        <span class="muk-av-icon">
          <ng-content select="[slot=icon]"></ng-content>
        </span>
      } @else if (initials()) {
        <span class="muk-av-text">{{ initials() }}</span>
      } @else {
        <!-- Default user icon -->
        <svg class="muk-av-fallback" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      }

      @if (status !== 'none') {
        <span class="muk-av-status" [ngClass]="'muk-av-status-' + status"></span>
      }

      <!-- Hidden iconSlot detector -->
      <span class="muk-av-icon-probe">
        <ng-content select="[slot=icon]"></ng-content>
      </span>
    </span>
  `,
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
    // ── INPUTS ──

    /** Image URL. */
    @Input() src?: string;

    /** Full name - used for initials and aria-label. */
    @Input() name?: string;

    /** Override - explicit initials (otherwise derived from name). */
    @Input() initialsOverride?: string;

    @Input() size: MukAvatarSize = 'md';
    @Input() shape: MukAvatarShape = 'circle';

    /** Color for initials background. 'auto' = derived from name hash. */
    @Input() color: MukAvatarColor = 'auto';

    /** Status indicator. */
    @Input() status: MukAvatarStatus = 'none';

    /** Optional border ring. */
    @Input() ring = false;

    /** Make it clickable - emits `clicked`. */
    @Input() clickable = false;

    /** Aria-label override (defaults to name). */
    @Input() ariaLabel?: string;


    // ── OUTPUTS ──

    @Output() clicked = new EventEmitter<MouseEvent>();


    // ── STATE ──

    readonly imageError = signal(false);


    // ── COMPUTED ──

    readonly initials = computed(() => {
        if (this.initialsOverride) return this.initialsOverride.toUpperCase().slice(0, 2);
        if (!this.name) return '';
        const parts = this.name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    });

    /** Auto-derived color from name. */
    private readonly autoColorIndex = computed(() => {
        const n = this.name || '';
        let hash = 0;
        for (let i = 0; i < n.length; i++) hash = (hash << 5) - hash + n.charCodeAt(i);
        return Math.abs(hash) % 6;
    });

    private readonly autoColors: MukAvatarColor[] = ['primary', 'success', 'warning', 'info', 'secondary', 'danger'];

    get resolvedColor(): MukAvatarColor {
        if (this.color !== 'auto') return this.color;
        if (!this.name) return 'neutral';
        return this.autoColors[this.autoColorIndex()];
    }

    /** Detect if [slot=icon] was projected. */
    get hasIconSlot(): boolean {
        // Lightweight check - if user passed icon slot, render via icon block
        return !!this.iconSlotHasContent;
    }

    private iconSlotHasContent = false;

    get hostClasses(): Record<string, boolean> {
        return {
            'muk-av': true,
            [`muk-av-size-${this.size}`]: true,
            [`muk-av-shape-${this.shape}`]: true,
            [`muk-av-color-${this.resolvedColor}`]: !this.src || this.imageError(),
            'has-ring': this.ring,
            'is-clickable': this.clickable,
        };
    }

    onClick(event: Event): void {
        if (!this.clickable) return;
        event.preventDefault();
        this.clicked.emit(event as MouseEvent);
    }
}


/**
 * MUK Avatar Group - stack of avatars with overflow count.
 *
 *   <muk-avatar-group [max]="3" size="md">
 *     <muk-avatar name="John D" />
 *     <muk-avatar name="Sarah L" />
 *     <muk-avatar name="Mike R" />
 *     <muk-avatar name="Eve K" />
 *     <muk-avatar name="Tom B" />
 *   </muk-avatar-group>
 */
@Component({
    selector: 'muk-avatar-group',
    standalone: true,
    imports: [CommonModule, AvatarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="muk-av-group" [class.has-overlap]="overlap">
      <ng-content></ng-content>
      @if (overflow > 0) {
        <muk-avatar
          [name]="'+' + overflow"
          [initialsOverride]="'+' + overflow"
          [size]="size"
          [shape]="shape"
          color="neutral"
          [ring]="true"
        ></muk-avatar>
      }
    </div>
  `,
    styles: [`
    .muk-av-group { display: inline-flex; align-items: center; }
    .muk-av-group.has-overlap ::ng-deep .muk-av + .muk-av { margin-left: -10px; }
    .muk-av-group ::ng-deep .muk-av { position: relative; z-index: 0; }
    .muk-av-group ::ng-deep .muk-av:hover { z-index: 1; }
  `],
})
export class AvatarGroupComponent {
    @Input() max = 4;
    @Input() overflow = 0;
    @Input() overlap = true;
    @Input() size: MukAvatarSize = 'md';
    @Input() shape: MukAvatarShape = 'circle';
}