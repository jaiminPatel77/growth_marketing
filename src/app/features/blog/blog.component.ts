import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component, DestroyRef, OnInit, inject, signal, computed, ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { WaveCanvasComponent } from '../../shared/components/wave-canvas/wave-canvas.component';
import { ArticleDialogComponent } from '../../shared/components/article-dialog/article-dialog.component';
import { GlassTiltDirective } from '../../shared/directives/glass-tilt.directive';
import { BlogService } from '../../core/services/blog.service';
import { SeoService } from '../../core/services/seo.service';
import { BlogPost } from '../../core/models/blog.model';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, DatePipe, WaveCanvasComponent, ArticleDialogComponent, GlassTiltDirective],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly posts = signal<BlogPost[]>([]);

  readonly categories = computed(() => {
    const categories = new Set(this.posts().map(post => post.category));
    categories.delete('All');
    return ['All', ...[...categories].sort((a, b) => a.localeCompare(b))];
  });
  readonly activeCategory = signal('All');
  readonly searchQuery = signal('');
  readonly selectedArticle = signal<BlogPost | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly articleLoading = signal(false);
  readonly articleError = signal('');
  readonly filteredPosts = computed(() => this.blogService.filterPosts(
    this.posts(), this.activeCategory(), this.searchQuery()
  ));

  ngOnInit(): void {
    this.loadPosts();
    this.route.queryParamMap.pipe(
      map(params => params.get('article')),
      distinctUntilChanged(),
      switchMap(slug => {
        this.selectedArticle.set(null);
        this.articleError.set('');
        this.articleLoading.set(slug !== null);
        this.seo.setPageMeta('Blog | Growth Marketing Agency',
          'Marketing insights, social media tips, and creative ideas from Growth Marketing Agency.');
        return slug === null ? of(null) : this.blogService.getArticle(slug).pipe(
          catchError(error => {
            this.articleError.set(error instanceof HttpErrorResponse && [400, 404].includes(error.status)
              ? 'This article is unavailable.' : 'The article could not be loaded. Please try again.');
            return of(null);
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(post => {
      this.articleLoading.set(false);
      this.selectedArticle.set(post);
      if (post) this.seo.setPageMeta(post.metaTitle || `${post.title} | Growth Marketing Agency`,
        post.metaDescription || post.excerpt);
    });
  }

  loadPosts(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.blogService.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: posts => {
        this.posts.set(posts);
        if (!this.categories().includes(this.activeCategory())) this.activeCategory.set('All');
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  closeArticle(): void {
    void this.router.navigate([], {
      relativeTo: this.route, queryParams: { article: null }, queryParamsHandling: 'merge', replaceUrl: true
    });
  }
}
