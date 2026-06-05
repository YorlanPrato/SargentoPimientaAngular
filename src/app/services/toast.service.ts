import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error';
  title: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 0;

  success(title: string, description?: string): void {
    this._addToast({ type: 'success', title, description });
  }

  error(title: string, description?: string): void {
    this._addToast({ type: 'error', title, description });
  }

  private _addToast(data: Omit<Toast, 'id'>): void {
    const id = ++this.nextId;
    this._toasts.update(list => [...list, { id, ...data }]);
    setTimeout(() => this.dismiss(id), 5000);
  }

  dismiss(id: number): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}
