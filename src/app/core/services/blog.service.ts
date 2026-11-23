import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog.model';
import { BLOG_POSTS } from '../../features/blog/data/blog-data';

/**
 * Interface for blog data source adapter.
 * Allows effortless swapping with a future Google Sheets adapter
 * without modifying any component UI code.
 */
export interface BlogDataSourceAdapter {
  fetchPosts(): Observable<BlogPost[]>;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly _posts = signal<BlogPost[]>(BLOG_POSTS);
  readonly posts = this._posts.asReadonly();

  /**
   * Returns top featured posts for the home page preview
   */
  getFeaturedPosts(limit: number = 3): BlogPost[] {
    return this._posts().slice(0, limit);
  }

  /**
   * Finds a blog post by its unique slug/id
   */
  getPostById(id: string): BlogPost | undefined {
    return this._posts().find(p => p.id === id);
  }

  /**
   * Filters posts by category and text search term
   */
  filterPosts(category: string, query: string): BlogPost[] {
    const term = query.trim().toLowerCase();
    return this._posts().filter(post => {
      const matchCategory = category === 'All' || post.category === category;
      const searchable = [
        post.id,
        post.title,
        post.excerpt,
        post.category,
        ...post.sections.map(s => `${s.heading} ${s.paragraph}`)
      ].join(' ').toLowerCase();
      const matchTerm = !term || searchable.includes(term);
      return matchCategory && matchTerm;
    });
  }

  /**
   * Extension point for future Google Sheets adapter
   */
  setAdapter(adapter: BlogDataSourceAdapter): void {
    adapter.fetchPosts().subscribe(posts => {
      this._posts.set(posts);
    });
  }
}
