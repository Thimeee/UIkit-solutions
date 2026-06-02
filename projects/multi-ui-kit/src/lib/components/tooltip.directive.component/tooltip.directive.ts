import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    Renderer2,
    inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type MukTooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type MukTooltipVariant = 'dark' | 'light' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type MukTooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

/**
 * MUK Tooltip Directive - lightweight, theme-aware tooltip.
 *
 * Apply to ANY element with [mukTooltip]:
 *
 *   <muk-button mukTooltip="Save your changes" tooltipPosition="top">
 *     Save
 *   </muk-button>
 *
 *   <i class="bi bi-info-circle" mukTooltip="Help text"></i>
 *
 *   <span [mukTooltip]="dynamicText" tooltipVariant="danger">!</span>
 *
 * ── OPTIONS ──
 *   mukTooltip          string  - the tooltip text (required)
 *   tooltipPosition     'top'|'bottom'|'left'|'right'  (top)
 *   tooltipVariant      'dark'|'light'|'primary'|'success'|'warning'|'danger'|'info'  (dark)
 *   tooltipTrigger      'hover'|'click'|'focus'|'manual'  (hover)
 *   tooltipDelay        number ms before showing  (200)
 *   tooltipDisabled     boolean  (false)
 *   tooltipMaxWidth     number px  (240)
 *
 * Manual mode:
 *   #tip="mukTooltip"
 *   (click)="tip.show()" / tip.hide() / tip.toggle()
 */
@Directive({
    selector: '[mukTooltip]',
    standalone: true,
    exportAs: 'mukTooltip',

})
export class TooltipDirective implements OnDestroy {
    @Input('mukTooltip') text: string = '';
    @Input('tooltipPosition') position: MukTooltipPosition = 'top';
    @Input('tooltipVariant') variant: MukTooltipVariant = 'dark';
    @Input('tooltipTrigger') trigger: MukTooltipTrigger = 'hover';
    @Input('tooltipDelay') delay: number = 200;
    @Input('tooltipDisabled') disabled: boolean = false;
    @Input('tooltipMaxWidth') maxWidth: number = 240;

    private host = inject<ElementRef<HTMLElement>>(ElementRef);
    private renderer = inject(Renderer2);
    private document = inject(DOCUMENT);

    private tooltipEl?: HTMLElement;
    private showTimer?: ReturnType<typeof setTimeout>;
    private isVisible = false;

    // ── HOST LISTENERS ──

    @HostListener('mouseenter')
    onEnter(): void {
        if (this.trigger === 'hover' && !this.disabled) this.scheduleShow();
    }

    @HostListener('mouseleave')
    onLeave(): void {
        if (this.trigger === 'hover') this.hide();
    }

    @HostListener('focusin')
    onFocus(): void {
        if (this.trigger === 'focus' && !this.disabled) this.scheduleShow();
    }

    @HostListener('focusout')
    onBlur(): void {
        if (this.trigger === 'focus') this.hide();
    }

    @HostListener('click')
    onClick(): void {
        if (this.trigger === 'click' && !this.disabled) this.toggle();
    }

    @HostListener('document:keydown.escape')
    onEsc(): void {
        if (this.isVisible) this.hide();
    }

    ngOnDestroy(): void {
        this.cleanup();
    }


    // ── PUBLIC API (for manual trigger via template ref) ──

    show(): void {
        if (this.disabled || this.isVisible || !this.text) return;
        this.createTooltip();
        this.isVisible = true;
        // Trigger entrance animation on next frame
        requestAnimationFrame(() => {
            this.tooltipEl?.classList.add('is-visible');
        });
    }

    hide(): void {
        if (this.showTimer) {
            clearTimeout(this.showTimer);
            this.showTimer = undefined;
        }
        if (!this.tooltipEl) return;
        this.tooltipEl.classList.remove('is-visible');
        const el = this.tooltipEl;
        setTimeout(() => {
            if (el?.parentNode) el.parentNode.removeChild(el);
            if (el === this.tooltipEl) this.tooltipEl = undefined;
        }, 150);
        this.isVisible = false;
    }

    toggle(): void {
        this.isVisible ? this.hide() : this.show();
    }


    // ── INTERNAL ──

    private scheduleShow(): void {
        if (this.showTimer) clearTimeout(this.showTimer);
        this.showTimer = setTimeout(() => this.show(), this.delay);
    }

    private createTooltip(): void {
        const tip = this.renderer.createElement('div') as HTMLElement;
        tip.className = `muk-tooltip muk-tooltip-${this.variant} muk-tooltip-pos-${this.position}`;
        tip.setAttribute('role', 'tooltip');
        tip.style.maxWidth = `${this.maxWidth}px`;
        tip.textContent = this.text;

        // Arrow
        const arrow = this.renderer.createElement('span') as HTMLElement;
        arrow.className = 'muk-tooltip-arrow';
        tip.appendChild(arrow);

        this.document.body.appendChild(tip);
        this.tooltipEl = tip;
        this.position_tooltip();
    }

    private position_tooltip(): void {
        if (!this.tooltipEl) return;
        const targetRect = this.host.nativeElement.getBoundingClientRect();
        const tipRect = this.tooltipEl.getBoundingClientRect();
        const gap = 8;
        let top = 0, left = 0;

        switch (this.position) {
            case 'top':
                top = targetRect.top - tipRect.height - gap;
                left = targetRect.left + (targetRect.width - tipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + gap;
                left = targetRect.left + (targetRect.width - tipRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tipRect.height) / 2;
                left = targetRect.left - tipRect.width - gap;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tipRect.height) / 2;
                left = targetRect.right + gap;
                break;
        }

        // Clamp to viewport
        const padding = 4;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        left = Math.max(padding, Math.min(left, vw - tipRect.width - padding));
        top = Math.max(padding, Math.min(top, vh - tipRect.height - padding));

        this.tooltipEl.style.position = 'fixed';
        this.tooltipEl.style.top = `${top}px`;
        this.tooltipEl.style.left = `${left}px`;
    }

    private cleanup(): void {
        if (this.showTimer) clearTimeout(this.showTimer);
        if (this.tooltipEl?.parentNode) {
            this.tooltipEl.parentNode.removeChild(this.tooltipEl);
        }
        this.tooltipEl = undefined;
        this.isVisible = false;
    }
}