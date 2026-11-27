import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BlogComponent } from './blog.component';

describe('BlogComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('shows loading, error, and empty states around a retry', () => {
    const fixture = TestBed.createComponent(BlogComponent);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading articles');
    http.expectOne('/api/blogs').flush({}, { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Articles are temporarily unavailable');
    fixture.componentInstance.loadPosts();
    http.expectOne('/api/blogs').flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No articles have been published yet');
  });
});
