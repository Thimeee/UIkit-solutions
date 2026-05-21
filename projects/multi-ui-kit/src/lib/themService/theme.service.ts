import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Theme mode.
 * - 'light' : force light
 * - 'dark'  : force dark
 * - 'auto'  : follow system preference (default)
 */
export type MukThemeMode = 'light' | 'dark' | 'auto';

/**
 * Resolved theme (what's actually applied right now).
 */
export type MukResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'muk-theme';
const CLASS_LIGHT = 'muk-theme-light';
const CLASS_DARK = 'muk-theme-dark';

/**
 * MUK Theme Service - dark/light/auto theme switching.
 *
 * Defaults:
 *  - 'auto' mode (follows OS preference) unless user has saved a choice
 *  - Persists choice to localStorage
 *  - Live updates when OS theme changes (while in 'auto')
 *
 * ── USAGE ──
 *
 * Inject and use:
 *   constructor(private theme: ThemeService) {}
 *
 *   toggleTheme()  { this.theme.toggle(); }
 *   useDark()      { this.theme.setMode('dark'); }
 *   useLight()     { this.theme.setMode('light'); }
 *   useSystem()    { this.theme.setMode('auto'); }
 *
 * Read state (signals):
 *   this.theme.mode()       // 'light' | 'dark' | 'auto'
 *   this.theme.resolved()   // 'light' | 'dark' (what's showing)
 *   this.theme.isDark()     // boolean
 *
 * RxJS subscribers:
 *   this.theme.mode$.subscribe(...)
 *   this.theme.resolved$.subscribe(...)
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);

  /** User's chosen mode. */
  readonly mode = signal<MukThemeMode>(this.loadInitialMode());

  /** Resolved theme (what's actually applied). */
  readonly resolved = computed<MukResolvedTheme>(() => {
    const m = this.mode();
    if (m === 'auto') return this.getSystemTheme();
    return m;
  });

  /** Convenience - is dark mode active right now? */
  readonly isDark = computed(() => this.resolved() === 'dark');

  // RxJS observables for non-signal consumers
  private modeSubject = new BehaviorSubject<MukThemeMode>(this.mode());
  private resolvedSubject = new BehaviorSubject<MukResolvedTheme>(this.resolved());

  readonly mode$: Observable<MukThemeMode> = this.modeSubject.asObservable();
  readonly resolved$: Observable<MukResolvedTheme> = this.resolvedSubject.asObservable();


  constructor() {
    this.applyTheme();

    effect(() => {
      const m = this.mode();
      this.applyTheme();
      this.persistMode(m);
      this.modeSubject.next(m);
      this.resolvedSubject.next(this.resolved());
    });

    this.watchSystemPreference();
  }


  // ── PUBLIC API ──

  /** Set the theme mode (light/dark/auto). */
  setMode(mode: MukThemeMode): void {
    this.mode.set(mode);
  }

  /** Toggle between light and dark. If 'auto', flips to opposite of resolved. */
  toggle(): void {
    const next: MukThemeMode = this.resolved() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
  }


  // ── PRIVATE ──

  private loadInitialMode(): MukThemeMode {
    if (typeof localStorage === 'undefined') return 'auto';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        return saved;
      }
    } catch {
      // localStorage might throw in private/sandboxed contexts
    }
    return 'auto';
  }

  private persistMode(mode: MukThemeMode): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, mode);
      }
    } catch {
      // silently ignore
    }
  }

  private getSystemTheme(): MukResolvedTheme {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private applyTheme(): void {
    const root = this.document.documentElement;
    const m = this.mode();

    // Clean up first
    root.classList.remove(CLASS_LIGHT, CLASS_DARK);

    // Apply class:
    //   'auto'  - no class, @media (prefers-color-scheme) takes over
    //   'light' - .muk-theme-light blocks the @media query
    //   'dark'  - .muk-theme-dark forces dark
    if (m === 'light') {
      root.classList.add(CLASS_LIGHT);
    } else if (m === 'dark') {
      root.classList.add(CLASS_DARK);
    }

    // data-theme attribute for non-Angular CSS or analytics
    root.setAttribute('data-theme', m === 'auto' ? this.getSystemTheme() : m);
  }

  private watchSystemPreference(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      // Only react if in 'auto' mode - explicit choices ignore OS
      if (this.mode() === 'auto') {
        this.applyTheme();
        this.resolvedSubject.next(this.resolved());
      }
    };

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler);
    } else if (typeof (mq as any).addListener === 'function') {
      (mq as any).addListener(handler);
    }
  }
}