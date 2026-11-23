import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div
      class="toast"
      [class.is-visible]="toastService.isVisible()"
      role="status"
      aria-live="polite"
      id="toast"
    >
      {{ toastService.message() }}
    </div>
  `
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}

