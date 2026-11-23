import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WelcomeIntroService } from '../../../core/services/welcome-intro.service';

@Component({
  selector: 'app-welcome-intro',
  standalone: true,
  templateUrl: './welcome-intro.component.html',
  styleUrl: './welcome-intro.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeIntroComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly welcomeIntroService = inject(WelcomeIntroService);
  private readonly isBrowser: boolean;

  @ViewChild('primaryVideo') primaryVideoRef?: ElementRef<HTMLVideoElement>;

  readonly isActive = signal<boolean>(false);
  readonly isVideoReady = signal<boolean>(false);
  readonly isFadingOut = signal<boolean>(false);

  // Audio state tracking
  readonly isAudible = signal<boolean>(false);
  readonly audioAutoplayBlocked = signal<boolean>(false);

  // Backwards compatibility getter/signal for isMuted
  readonly isMuted = computed<boolean>(() => !this.isAudible());

  // Dynamic audio button label: "Mute" | "Unmute" | "Enable Sound"
  readonly audioButtonLabel = computed<string>(() => {
    if (this.isAudible()) {
      return 'Mute';
    }
    if (this.audioAutoplayBlocked()) {
      return 'Enable Sound';
    }
    return 'Unmute';
  });

  // Accessible aria-label for audio control
  readonly audioAriaLabel = computed<string>(() => {
    if (this.isAudible()) {
      return 'Mute video audio';
    }
    if (this.audioAutoplayBlocked()) {
      return 'Enable sound for welcome video';
    }
    return 'Unmute video audio';
  });

  private loadTimeoutId: any = null;
  private maxDurationTimeoutId: any = null;
  private fadeTimeoutId: any = null;
  private hasFinished = false;
  private autoplayAttemptStarted = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    // Only run on fresh page load if not yet completed during this session
    if (!this.welcomeIntroService.hasPlayed()) {
      this.isActive.set(true);

      // Lock body scroll while intro is playing
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.overflow = 'hidden';
      }

      // Check prefers-reduced-motion: skip intro immediately if motion is reduced
      const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
      if (hasMatchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.finishIntro(true);
        return;
      }

      // Safety fallback: if video doesn't ready within 6s, gracefully exit
      this.loadTimeoutId = setTimeout(() => {
        if (!this.isVideoReady() && this.isActive()) {
          console.warn('Welcome intro video load timeout reached. Falling back to main website.');
          this.finishIntro(true);
        }
      }, 6000);

      // Max duration fallback: mascot video is ~10s. If after 14s it hasn't ended, auto-finish.
      this.maxDurationTimeoutId = setTimeout(() => {
        if (this.isActive() && !this.hasFinished) {
          this.finishIntro();
        }
      }, 14000);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.isActive()) return;
    const video = this.primaryVideoRef?.nativeElement;
    if (video && video.readyState >= 2) {
      this.startAutoplayFlow();
    }
  }

  onVideoReady(): void {
    this.startAutoplayFlow();
  }

  private startAutoplayFlow(): void {
    if (this.autoplayAttemptStarted || !this.isActive()) return;
    this.autoplayAttemptStarted = true;
    this.isVideoReady.set(true);

    if (this.loadTimeoutId) {
      clearTimeout(this.loadTimeoutId);
      this.loadTimeoutId = null;
    }

    const video = this.primaryVideoRef?.nativeElement;
    if (video) {
      // 1. On initialization, attempt to play with sound enabled (muted = false, volume = 1)
      video.defaultMuted = false;
      video.muted = false;
      video.volume = 1;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Unmuted autoplay succeeded
            this.isAudible.set(true);
            this.audioAutoplayBlocked.set(false);
          })
          .catch((err) => {
            // Unmuted autoplay was prevented by browser policy.
            // Retrying muted to keep video playing smoothly without blocking the visitor.
            console.warn('Unmuted autoplay prevented by browser policy, retrying muted:', err);
            video.muted = true;
            this.isAudible.set(false);
            this.audioAutoplayBlocked.set(true);

            const retryPromise = video.play();
            if (retryPromise !== undefined) {
              retryPromise.catch((retryErr) => {
                console.warn('Muted autoplay also blocked:', retryErr);
                this.finishIntro(true);
              });
            }
          });
      }
    }
  }

  toggleSound(): void {
    const video = this.primaryVideoRef?.nativeElement;
    if (!video) return;

    if (this.isAudible()) {
      // Audio is currently playing -> Mute
      video.muted = true;
      this.isAudible.set(false);
      this.audioAutoplayBlocked.set(false);
    } else {
      // Audio is muted (or unmuted autoplay was blocked) -> Enable Sound / Unmute
      video.muted = false;
      video.volume = 1;
      this.isAudible.set(true);
      this.audioAutoplayBlocked.set(false);

      // If playback was paused by browser during audio state change, resume within interaction
      if (video.paused) {
        video.play()?.catch((err) => {
          console.warn('Playback resume error on enabling sound:', err);
        });
      }
    }
  }

  onVideoEnded(): void {
    this.finishIntro();
  }

  onVideoError(event: Event): void {
    console.warn('Welcome intro video encountered error, falling back:', event);
    this.finishIntro(true);
  }

  skipIntro(): void {
    this.finishIntro(false);
  }

  finishIntro(immediate = false): void {
    if (this.hasFinished) return;
    this.hasFinished = true;

    this.clearAllTimers();

    // Release body scroll lock
    if (this.isBrowser && typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
    }

    if (immediate) {
      this.isActive.set(false);
      this.welcomeIntroService.markPlayed();
      this.cleanupVideo();
      return;
    }

    // Smooth ~600ms fade-out transition
    this.isFadingOut.set(true);

    this.fadeTimeoutId = setTimeout(() => {
      this.isActive.set(false);
      this.welcomeIntroService.markPlayed();
      this.cleanupVideo();
    }, 600);
  }

  private cleanupVideo(): void {
    if (this.primaryVideoRef?.nativeElement) {
      const vid = this.primaryVideoRef.nativeElement;
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
    }
  }

  private clearAllTimers(): void {
    if (this.loadTimeoutId) {
      clearTimeout(this.loadTimeoutId);
      this.loadTimeoutId = null;
    }
    if (this.maxDurationTimeoutId) {
      clearTimeout(this.maxDurationTimeoutId);
      this.maxDurationTimeoutId = null;
    }
    if (this.fadeTimeoutId) {
      clearTimeout(this.fadeTimeoutId);
      this.fadeTimeoutId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
    if (this.isBrowser && typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
    }
    this.cleanupVideo();
  }
}
