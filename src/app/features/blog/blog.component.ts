import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WaveCanvasComponent } from '../../shared/components/wave-canvas/wave-canvas.component';
import { ArticleDialogComponent } from '../../shared/components/article-dialog/article-dialog.component';
import { GlassTiltDirective } from '../../shared/directives/glass-tilt.directive';
import { BlogService } from '../../core/services/blog.service';
import { SeoService } from '../../core/services/seo.service';
import { BlogPost } from '../../core/models/blog.model';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, FormsModule, WaveCanvasComponent, ArticleDialogComponent, GlassTiltDirective],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly seoService = inject(SeoService);

  readonly categories = ['All', 'Marketing', 'Social Media', 'Creative'] as const;
  readonly activeCategory = signal<string>('All');
  readonly searchQuery = signal<string>('');
  readonly selectedArticle = signal<BlogPost | null>(null);

  readonly filteredPosts = computed<BlogPost[]>(() => {
    return this.blogService.filterPosts(
      this.activeCategory(),
      this.searchQuery()
    );
  });

  ngOnInit(): void {
    this.seoService.setPageMeta(
      'Blog | Growth Marketing Agency',
      'Marketing insights, social media tips, and creative ideas from Growth Marketing Agency.'
    );
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  openArticle(post: BlogPost): void {
    this.selectedArticle.set(post);
  }

  closeArticle(): void {
    this.selectedArticle.set(null);
  }
}

