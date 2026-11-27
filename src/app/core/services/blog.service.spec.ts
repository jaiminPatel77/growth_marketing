import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BlogPost } from '../models/blog.model';
import { BlogService } from './blog.service';

const post: BlogPost = {
  id: '1', slug: 'marketing-ideas', title: 'Marketing Ideas', excerpt: 'An introduction',
  content: 'This article contains a section about Reels.', category: 'Marketing', color: 'orange',
  icon: 'chart', featured: true, author: 'Jane Doe', publishedAt: '2026-11-21T00:00:00.000Z',
  coverImageUrl: '', metaTitle: 'Marketing Ideas', metaDescription: ''
};

describe('BlogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  }));

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('requests the published list and a detail by slug', () => {
    const service = TestBed.inject(BlogService);
    const http = TestBed.inject(HttpTestingController);
    service.list().subscribe(posts => expect(posts).toEqual([post]));
    http.expectOne('/api/blogs').flush([post]);
    service.getArticle(post.slug).subscribe(article => expect(article).toEqual(post));
    http.expectOne('/api/blogs?slug=marketing-ideas').flush(post);
  });

  it('combines category and full article search', () => {
    const service = TestBed.inject(BlogService);
    expect(service.filterPosts([post], 'Marketing', '  REELS  ')).toEqual([post]);
    expect(service.filterPosts([post], 'Creative', 'reels')).toEqual([]);
    expect(service.filterPosts([post], 'All', 'missing')).toEqual([]);
  });
});
