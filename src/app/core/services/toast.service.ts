import { DestroyRef, Injectable, inject, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  kind: ToastKind;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private readonly activeTimeouts = new Map<string, number>();

  constructor() {
    this.destroyRef.onDestroy(() => {
      for (const timeoutId of this.activeTimeouts.values()) {
        clearTimeout(timeoutId);
      }
      this.activeTimeouts.clear();
    });
  }

  show(kind: ToastKind, message: string, timeoutMs = 3000): void {
    const id = crypto.randomUUID();
    this._toasts.update((items) => [...items, { id, kind, message }]);

    const timeoutId = window.setTimeout(() => {
      this.dismiss(id);
    }, timeoutMs);
    this.activeTimeouts.set(id, timeoutId);
  }

  success(message: string, timeoutMs?: number): void {
    this.show('success', message, timeoutMs);
  }

  error(message: string, timeoutMs?: number): void {
    this.show('error', message, timeoutMs);
  }

  info(message: string, timeoutMs?: number): void {
    this.show('info', message, timeoutMs);
  }

  dismiss(id: string): void {
    const timeoutId = this.activeTimeouts.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      this.activeTimeouts.delete(id);
    }

    this._toasts.update((items) => items.filter((t) => t.id !== id));
  }
}
