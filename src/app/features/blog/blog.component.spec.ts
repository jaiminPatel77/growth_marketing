import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BlogComponent } from './blog.component';

describe('BlogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create blog component', () => {
    const fixture = TestBed.createComponent(BlogComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should filter posts when category changes', () => {
    const fixture = TestBed.createComponent(BlogComponent);
    const comp = fixture.componentInstance;
    comp.setCategory('Social Media');
    fixture.detectChanges();
    expect(comp.filteredPosts().every(p => p.category === 'Social Media')).toBe(true);
  });

  it('should open and close article reader', () => {
    const fixture = TestBed.createComponent(BlogComponent);
    const comp = fixture.componentInstance;
    const samplePost = comp.filteredPosts()[0];
    comp.openArticle(samplePost);
    expect(comp.selectedArticle()).toBe(samplePost);
    comp.closeArticle();
    expect(comp.selectedArticle()).toBeNull();
  });
});

