import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { BlogPost } from '../../../core/models/blog.model';

@Component({
  selector: 'app-article-dialog',
  standalone: true,
  templateUrl: './article-dialog.component.html',
  styleUrl: './article-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleDialogComponent {
  @Input() post: BlogPost | null = null;
  @Output() closeDialog = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.post) {
      this.closeDialog.emit();
    }
  }

  handleBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('article-dialog-backdrop')) {
      this.closeDialog.emit();
    }
  }
}

