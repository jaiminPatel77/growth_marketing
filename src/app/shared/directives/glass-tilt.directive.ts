import {
  Directive,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appGlassTilt]',
  standalone: true
})
export class GlassTiltDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly ngZone = inject(NgZone);
  private readonly isBrowser: boolean;

  private isHovered = false;
  private rafId: number | null = null;
  private bounds: DOMRect | null = null;
  private targetX = 0;
  private targetY = 0;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    if (!hasMatchMedia) return;

    // Only enable on devices with hover capability (desktop/fine pointer)
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsHover || prefersReducedMotion) {
      return;
    }

    const host = this.el.nativeElement;
    if (!host) return;

    // Run outside Angular zone so pointermove never triggers Angular change detection
    this.ngZone.runOutsideAngular(() => {
      host.addEventListener('pointerenter', this.onPointerEnter, { passive: true });
      host.addEventListener('pointermove', this.onPointerMove, { passive: true });
      host.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    });
  }

  private readonly onPointerEnter = (e: PointerEvent): void => {
    if (e.pointerType !== 'mouse') return;
    this.isHovered = true;
    this.bounds = this.el.nativeElement.getBoundingClientRect();
    this.el.nativeElement.style.willChange = 'transform, box-shadow';
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    if (!this.isHovered || !this.bounds || e.pointerType !== 'mouse') return;

    const x = e.clientX - this.bounds.left;
    const y = e.clientY - this.bounds.top;

    // Relative -1 to 1 from center
    this.targetX = (x / this.bounds.width - 0.5) * 2;
    this.targetY = (y / this.bounds.height - 0.5) * 2;

    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.updateTransform);
    }
  };

  private readonly updateTransform = (): void => {
    this.rafId = null;
    if (!this.isHovered) return;

    // Restrained subtle tilt: max ~3.5 deg
    const maxTilt = 3.5;
    const rotateX = -this.targetY * maxTilt;
    const rotateY = this.targetX * maxTilt;

    const host = this.el.nativeElement;
    host.style.transform = `perspective(1000px) translateY(-6px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    host.style.setProperty('--mouse-x', `${((this.targetX + 1) * 50).toFixed(1)}%`);
    host.style.setProperty('--mouse-y', `${((this.targetY + 1) * 50).toFixed(1)}%`);
  };

  private readonly onPointerLeave = (e: PointerEvent): void => {
    if (e.pointerType !== 'mouse') return;
    this.isHovered = false;
    this.bounds = null;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    const host = this.el.nativeElement;
    host.style.transform = '';
    host.style.removeProperty('--mouse-x');
    host.style.removeProperty('--mouse-y');
    host.style.willChange = '';
  };

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    const host = this.el?.nativeElement;
    if (host && this.isBrowser) {
      host.removeEventListener('pointerenter', this.onPointerEnter);
      host.removeEventListener('pointermove', this.onPointerMove);
      host.removeEventListener('pointerleave', this.onPointerLeave);
    }
  }
}

