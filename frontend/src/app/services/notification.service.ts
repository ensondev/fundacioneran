import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  message = signal<string | null>(null);
  type = signal<'success' | 'error' | null>(null);

  showSuccess(msg: string) {
    this.message.set(msg);
    this.type.set('success');
    this.autoClear();
  }

  showError(msg: string) {
    this.message.set(msg);
    this.type.set('error');
    this.autoClear();
  }

  clear() {
    this.message.set(null);
    this.type.set(null);
  }

  private autoClear() {
    setTimeout(() => this.clear(), 3000); // Se limpia automáticamente en 3 segundos
  }
}
