import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-welcome-video-modal',
  standalone: true,
  templateUrl: './welcome-video-modal.component.html',
  styleUrl: './welcome-video-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeVideoModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;
  @ViewChild('closeBtn') closeBtn?: ElementRef<HTMLButtonElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        setTimeout(() => {
          this.closeBtn?.nativeElement.focus();
        }, 50);
      } else {
        this.pauseVideo();
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.handleClose();
    }
  }

  handleBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.handleClose();
    }
  }

  handleClose(): void {
    this.pauseVideo();
    this.closeModal.emit();
  }

  private pauseVideo(): void {
    if (this.videoPlayer?.nativeElement) {
      const vid = this.videoPlayer.nativeElement;
      vid.pause();
      vid.currentTime = 0;
    }
  }
}

