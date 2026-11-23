import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ElementRef,
  inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WaveCanvasComponent } from '../../shared/components/wave-canvas/wave-canvas.component';
import { GlassTiltDirective } from '../../shared/directives/glass-tilt.directive';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, WaveCanvasComponent, GlassTiltDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit, OnDestroy {
  private readonly seoService = inject(SeoService);
  private readonly elementRef = inject(ElementRef);
  private readonly isBrowser: boolean;
  private intersectionObserver?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.seoService.setPageMeta(
      'About Us | Growth Marketing Agency',
      'Meet Growth Marketing Agency and learn how our team approaches purposeful creative marketing.'
    );

    if (this.isBrowser) {
      this.setupScrollReveal();
    }
  }

  private setupScrollReveal(): void {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.body.classList.add('js-ready');
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          this.intersectionObserver?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -24px 0px'
    });

    const elements = this.elementRef.nativeElement.querySelectorAll('.reveal');
    elements.forEach((el: Element) => this.intersectionObserver?.observe(el));
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

