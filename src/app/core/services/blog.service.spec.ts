import { TestBed } from '@angular/core/testing';
import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial sample blog posts', () => {
    const posts = service.posts();
    expect(posts.length).toBeGreaterThan(0);
  });

  it('should return featured posts with limit', () => {
    const featured = service.getFeaturedPosts(3);
    expect(featured.length).toBe(3);
  });

  it('should filter posts by category', () => {
    const marketingPosts = service.filterPosts('Marketing', '');
    expect(marketingPosts.every(p => p.category === 'Marketing')).toBe(true);
  });

  it('should filter posts by search query', () => {
    const searchResult = service.filterPosts('All', 'reels');
    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult[0].title.toLowerCase()).toContain('video');
  });

  it('should find post by id', () => {
    const post = service.getPostById('5-marketing-ideas');
    expect(post).toBeDefined();
    expect(post?.title).toBe('5 Practical Marketing Ideas for Growing Businesses');
  });
});

