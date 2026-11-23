import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly message = signal<string>('');
  readonly isVisible = signal<boolean>(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(text: string, durationMs: number = 3500): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.message.set(text);
    this.isVisible.set(true);
    this.timer = setTimeout(() => {
      this.isVisible.set(false);
      this.timer = null;
    }, durationMs);
  }

  hide(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isVisible.set(false);
  }
}

