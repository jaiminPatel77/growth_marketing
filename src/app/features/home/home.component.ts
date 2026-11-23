import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ElementRef,
  inject,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WaveCanvasComponent } from '../../shared/components/wave-canvas/wave-canvas.component';
import { ArticleDialogComponent } from '../../shared/components/article-dialog/article-dialog.component';
import { GlassTiltDirective } from '../../shared/directives/glass-tilt.directive';
import { BlogService } from '../../core/services/blog.service';
import { ToastService } from '../../core/services/toast.service';
import { SeoService } from '../../core/services/seo.service';
import { BlogPost } from '../../core/models/blog.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    WaveCanvasComponent,
    ArticleDialogComponent,
    GlassTiltDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly blogService = inject(BlogService);
  private readonly toastService = inject(ToastService);
  private readonly seoService = inject(SeoService);
  private readonly elementRef = inject(ElementRef);
  private readonly isBrowser: boolean;

  readonly featuredPosts = signal<BlogPost[]>([]);
  readonly selectedArticle = signal<BlogPost | null>(null);
  readonly isSubmitting = signal<boolean>(false);

  readonly inquiryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    business: ['', [Validators.required, Validators.maxLength(100)]],
    service: ['Social Media Marketing', Validators.required],
    message: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  private intersectionObserver?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.seoService.setPageMeta(
      'Home | Growth Marketing Agency',
      'Digital marketing, Meta Ads, social media, reels and creative design for your growing business.'
    );

    this.featuredPosts.set(this.blogService.getFeaturedPosts(3));

    if (this.isBrowser) {
      this.setupScrollReveal();
    }
  }

  openArticle(post: BlogPost): void {
    this.selectedArticle.set(post);
  }

  closeArticle(): void {
    this.selectedArticle.set(null);
  }

  async copyEnquiry(): Promise<void> {
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      this.toastService.show('Please fill in all required enquiry fields.');
      return;
    }

    const { name, business, service, message } = this.inquiryForm.value;
    const enquiryText = `Growth Marketing Agency — Website enquiry\nName: ${name}\nBusiness: ${business}\nService: ${service}\nMessage: ${message}`;

    this.isSubmitting.set(true);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(enquiryText);
        this.toastService.show('Enquiry copied. You can paste it into a message.');
      } else {
        this.copyFallback(enquiryText);
      }
    } catch {
      this.copyFallback(enquiryText);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private copyFallback(text: string): void {
    try {
      const tempArea = document.createElement('textarea');
      tempArea.value = text;
      tempArea.style.position = 'fixed';
      tempArea.style.opacity = '0';
      document.body.appendChild(tempArea);
      tempArea.focus();
      tempArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(tempArea);

      if (success) {
        this.toastService.show('Enquiry copied. You can paste it into a message.');
      } else {
        this.toastService.show('Copy is unavailable in this browser.');
      }
    } catch {
      this.toastService.show('Copy is unavailable in this browser.');
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
