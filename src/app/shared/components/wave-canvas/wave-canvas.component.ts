import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-wave-canvas',
  standalone: true,
  template: `<canvas #waveCanvas id="wave-canvas" aria-hidden="true"></canvas>`,
  styles: [`
    :host {
      display: contents;
    }
    #wave-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.55;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaveCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('waveCanvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private rafId: number = 0;
  private resizeListener?: () => void;
  private visibilityListener?: () => void;
  private mediaQueryListener?: (e: MediaQueryListEvent) => void;
  private mediaQuery?: MediaQueryList;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.canvasRef) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastDraw = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (ms: number) => {
      if (document.hidden) {
        this.rafId = 0;
        return;
      }
      if (ms - lastDraw < 32 && !this.mediaQuery?.matches) {
        this.rafId = requestAnimationFrame(draw);
        return;
      }
      lastDraw = ms;
      ctx.clearRect(0, 0, width, height);
      const t = this.mediaQuery?.matches ? 0 : ms * 0.00022;
      const baseY = height * 0.72;

      for (let j = 0; j < 6; j++) {
        const isOrange = j % 2 === 0;
        const amplitude = 14 + j * 5;
        ctx.strokeStyle = isOrange ? 'rgba(249,120,43,.13)' : 'rgba(9,99,112,.10)';
        ctx.lineWidth = j % 3 === 0 ? 1.4 : 1;
        ctx.beginPath();
        for (let x = -20; x <= width + 20; x += 7) {
          const y = baseY + (j - 2) * 12 + Math.sin(x * 0.009 + t * 5 + j * 0.52) * amplitude + Math.cos(x * 0.017 - t * 2 + j) * 10;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (let i = 0; i < 41; i++) {
        const x = (i * 83.27 + Math.sin(t * 10 + i) * 11) % Math.max(width, 1);
        const y = baseY + Math.sin(x * 0.009 + t * 5 + i * 0.1) * 38 + Math.cos(i * 2.5) * 38;
        ctx.beginPath();
        ctx.arc(x, y, i % 5 === 0 ? 1.6 : 1.0, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(242,113,39,.27)' : 'rgba(9,109,117,.20)';
        ctx.fill();
      }

      if (!this.mediaQuery?.matches) {
        this.rafId = requestAnimationFrame(draw);
      }
    };

    resize();
    this.resizeListener = () => {
      resize();
      if (this.mediaQuery?.matches) {
        draw(0);
      }
    };
    window.addEventListener('resize', this.resizeListener, { passive: true });

    if (this.mediaQuery.matches) {
      draw(0);
    } else {
      this.rafId = requestAnimationFrame(draw);
    }

    this.mediaQueryListener = () => {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
      }
      resize();
      if (this.mediaQuery?.matches) {
        draw(0);
      } else {
        this.rafId = requestAnimationFrame(draw);
      }
    };

    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener('change', this.mediaQueryListener);
    }

    this.visibilityListener = () => {
      if (!document.hidden && !this.rafId && !this.mediaQuery?.matches) {
        this.rafId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', this.visibilityListener);
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.visibilityListener) {
      document.removeEventListener('visibilitychange', this.visibilityListener);
    }
    if (this.mediaQuery && this.mediaQueryListener && this.mediaQuery.removeEventListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
  }
}

