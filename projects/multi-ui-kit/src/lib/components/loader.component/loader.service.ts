import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface LoaderState {
  loading: boolean;
  message?: string;
}

/**
 * Global Loader Service
 *
 * Use this to control the global page loader from anywhere
 * (HTTP interceptor, guard, resolver, component).
 *
 * Supports a counter so multiple parallel show() calls work correctly -
 * loader hides only when all show() calls have matching hide() calls.
 *
 * Examples:
 *
 *  // Simple show / hide
 *  this.loader.show('Loading users');
 *  // ... await data ...
 *  this.loader.hide();
 *
 *  // Wrap a promise
 *  await this.loader.wrap(api.getUsers(), 'Loading users');
 *
 *  // Force reset (e.g. on route change)
 *  this.loader.reset();
 */
@Injectable({ providedIn: 'root' })
export class LoaderService {
  private state = new BehaviorSubject<LoaderState>({ loading: false });
  private counter = 0;

  /** Full state observable */
  readonly state$: Observable<LoaderState> = this.state.asObservable();

  /** Boolean loading observable */
  readonly isLoading$: Observable<boolean> = this.state$.pipe(map((s) => s.loading));

  /** Message observable */
  readonly message$: Observable<string | undefined> = this.state$.pipe(map((s) => s.message));

  /** Current snapshot */
  get isLoading(): boolean {
    return this.state.value.loading;
  }

  /**
   * Show the loader. Each show() increments an internal counter,
   * so concurrent operations are tracked correctly.
   */
  show(message?: string): void {
    this.counter++;
    this.state.next({ loading: true, message: message ?? this.state.value.message });
  }

  /**
   * Hide the loader. Only fully hides when all show() calls
   * have been matched with hide() calls.
   */
  hide(): void {
    this.counter = Math.max(0, this.counter - 1);
    if (this.counter === 0) {
      this.state.next({ loading: false, message: undefined });
    }
  }

  /**
   * Force reset the loader (clear counter, hide immediately).
   * Useful on route navigation or unexpected errors.
   */
  reset(): void {
    this.counter = 0;
    this.state.next({ loading: false, message: undefined });
  }

  /**
   * Update the message without changing loading state.
   */
  setMessage(message: string): void {
    if (this.state.value.loading) {
      this.state.next({ ...this.state.value, message });
    }
  }

  /**
   * Wrap a promise or observable-like with automatic show/hide.
   */
  async wrap<T>(work: Promise<T>, message?: string): Promise<T> {
    this.show(message);
    try {
      return await work;
    } finally {
      this.hide();
    }
  }
}
