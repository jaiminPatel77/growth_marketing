import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ElementRef,
  DestroyRef,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { WaveCanvasComponent } from '../../shared/components/wave-canvas/wave-canvas.component';
import { GlassTiltDirective } from '../../shared/directives/glass-tilt.directive';
import { BlogService } from '../../core/services/blog.service';
import { ToastService } from '../../core/services/toast.service';
import { SeoService } from '../../core/services/seo.service';
import { EnquiryService } from '../../core/services/enquiry.service';
import { BlogPost } from '../../core/models/blog.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    WaveCanvasComponent,
    DatePipe,
    GlassTiltDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly enquiryService = inject(EnquiryService);
  private readonly posts = signal<BlogPost[]>([]);
  private readonly blogService = inject(BlogService);
  private readonly toastService = inject(ToastService);
  private readonly seoService = inject(SeoService);
  private readonly elementRef = inject(ElementRef);
  private readonly isBrowser: boolean;

  readonly featuredPosts = computed(() => {
    const posts = this.posts();
    return [...posts.filter(post => post.featured), ...posts.filter(post => !post.featured)].slice(0, 3);
  });
  readonly blogLoading = signal(true);
  readonly blogError = signal(false);
  readonly isSubmitting = signal(false);

  readonly inquiryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    phone: ['', [Validators.required, Validators.maxLength(25),
      Validators.pattern(/^\+?(?=(?:\D*\d){7,15}\D*$)[\d ().-]+$/)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), Validators.maxLength(254)]],
    business: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    service: ['Social Media Marketing', Validators.required],
    message: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(1000)]],
    website: ['']
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

    this.blogService.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: posts => {
        this.posts.set(posts);
        this.blogLoading.set(false);
      },
      error: () => {
        this.blogError.set(true);
        this.blogLoading.set(false);
      }
    });

    if (this.isBrowser) {
      this.setupScrollReveal();
    }
  }

  submitEnquiry(): void {
    if (this.isSubmitting()) return;
    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      this.toastService.show('Please check the required enquiry fields.');
      return;
    }

    const enquiry = this.inquiryForm.getRawValue();
    this.isSubmitting.set(true);
    this.inquiryForm.disable();
    const finish = () => {
      this.inquiryForm.enable();
      this.isSubmitting.set(false);
    };

    this.enquiryService.submit(enquiry).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: response => {
        finish();
        if (response?.success !== true) {
          this.toastService.show('We could not confirm your enquiry. Please try again.');
          return;
        }
        this.inquiryForm.reset();
        this.toastService.show('Thanks! Your enquiry has been sent.');
      },
      error: (error: unknown) => {
        finish();
        const status = error instanceof HttpErrorResponse ? error.status : 0;
        const message = status === 429 ? 'Too many attempts. Please wait before trying again.'
          : status === 400 ? 'Please check the required enquiry fields.'
          : 'We could not confirm your enquiry. Please try again.';
        this.toastService.show(message);
      }
    });
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
