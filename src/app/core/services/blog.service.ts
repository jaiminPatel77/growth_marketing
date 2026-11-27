import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { timeout } from 'rxjs';
import { BlogPost } from '../models/blog.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);

  list() {
    return this.http.get<BlogPost[]>('/api/blogs').pipe(timeout(15000));
  }

  getArticle(slug: string) {
    return this.http.get<BlogPost>('/api/blogs', { params: { slug } }).pipe(timeout(15000));
  }

  filterPosts(posts: BlogPost[], category: string, query: string): BlogPost[] {
    const term = query.trim().toLowerCase();
    return posts.filter(post =>
      (category === 'All' || post.category === category) &&
      [post.slug, post.title, post.excerpt, post.category, post.author, post.content]
        .some(value => value.toLowerCase().includes(term))
    );
  }
}
