import { Injectable, Inject, PLATFORM_ID, signal, computed, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Theme preference set by the user.
 * - 'auto'  : follow system preference (default)
 * - 'light' : force light, overrides system
 * - 'dark'  : force dark, overrides system
 */
export type MukThemePreference = 'auto' | 'light' | 'dark';

/**
 * The resolved theme that is actually applied at the moment.
 * 'auto' resolves to 'light' or 'dark' based on system.
 */
export type MukResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'muk-theme';
const CLASS_LIGHT = 'muk-theme-light';
const CLASS_DARK = 'muk-theme-dark';

/**
 * MUK Theme Service
 *
 * Manages app theme with three modes: auto, light, dark.
 * Persists preference in localStorage.
 * Listens to system color-scheme changes.
 *
 * ── USAGE ──
 *
 * Inject and read current state:
 *   constructor(private theme: ThemeService) {}
 *   isDark = this.theme.resolvedTheme; // signal: 'light' | 'dark'
 *
 * Set preference:
 *   this.theme.setTheme('dark');
 *   this.theme.setTheme('light');
 *   this.theme.setTheme('auto');
 *
 * Toggle light/dark (skips auto):
 *   this.theme.toggle();
 *
 * In template:
 *   <button (click)="theme.toggle()">
 *     {{ theme.resolvedTheme() === 'dark' ? '☀️' : '🌙' }}
 *   </button>
 *
 * ── INITIALIZATION (avoid FOUC) ──
 *
 * To avoid a flash of light theme on page load, add this inline
 * <script> in your index.html BEFORE any stylesheets:
 *
 *   <script>
 *     (function() {
 *       try {
 *         var pref = localStorage.getItem('muk-theme') || 'auto';
 *         var isDark = pref === 'dark' ||
 *           (pref === 'auto' &&
 *            window.matchMedia('(prefers-color-scheme: dark)').matches);
 *         document.documentElement.classList.add(
 *           isDark ? 'muk-theme-dark' : 'muk-theme-light'
 *         );
 *       } catch(e) {}
 *     })();
 *   </script>
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser: boolean;
  private readonly mediaQuery?: MediaQueryList;

  /** User's preference (what they explicitly chose). */
  readonly preference = signal<MukThemePreference>('auto');

  /** System color scheme preference. */
  private readonly systemPrefersDark = signal<boolean>(false);

  /** Actually-applied theme (computed). */
  readonly resolvedTheme = computed<MukResolvedTheme>(() => {
    const pref = this.preference();
    if (pref === 'dark') return 'dark';
    if (pref === 'light') return 'light';
    return this.systemPrefersDark() ? 'dark' : 'light';
  });

  /** Convenience boolean signal. */
  readonly isDark = computed(() => this.resolvedTheme() === 'dark');

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Load persisted preference
      this.loadPreference();

      // Setup system preference listener
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemPrefersDark.set(this.mediaQuery.matches);

      // React to system changes
      this.mediaQuery.addEventListener('change', this.onSystemChange);

      // Apply theme whenever resolved theme changes
      effect(() => {
        this.applyThemeClass(this.resolvedTheme());
      });

      // Persist preference changes
      effect(() => {
        this.persistPreference(this.preference());
      });
    }
  }

  // ── PUBLIC API ──

  /**
   * Set theme preference.
   * - 'auto'  : follow system
   * - 'light' : force light
   * - 'dark'  : force dark
   */
  setTheme(pref: MukThemePreference): void {
    this.preference.set(pref);
  }

  /**
   * Toggle between light and dark.
   * If currently 'auto', toggles based on resolved theme.
   */
  toggle(): void {
    const current = this.resolvedTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  /**
   * Reset to system preference.
   */
  useAuto(): void {
    this.setTheme('auto');
  }

  // ── PRIVATE ──

  private onSystemChange = (e: MediaQueryListEvent): void => {
    this.systemPrefersDark.set(e.matches);
  };

  private loadPreference(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as MukThemePreference | null;
      if (stored === 'auto' || stored === 'light' || stored === 'dark') {
        this.preference.set(stored);
      }
    } catch {
      // localStorage unavailable - ignore
    }
  }

  private persistPreference(pref: MukThemePreference): void {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
    } catch {
      // localStorage unavailable - ignore
    }
  }

  private applyThemeClass(resolved: MukResolvedTheme): void {
    const html = document.documentElement;

    // Remove both classes first to handle any inline-script init
    html.classList.remove(CLASS_LIGHT, CLASS_DARK);

    // Apply the resolved class
    html.classList.add(resolved === 'dark' ? CLASS_DARK : CLASS_LIGHT);
  }
}
