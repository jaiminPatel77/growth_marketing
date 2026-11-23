import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create home component', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  }, 15000);

  it('should load featured blog posts on init', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.featuredPosts().length).toBe(3);
  }, 15000);

  it('should validate inquiry form fields', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const comp = fixture.componentInstance;
    expect(comp.inquiryForm.valid).toBe(false);

    comp.inquiryForm.patchValue({
      name: 'Jane Doe',
      business: 'Acme Corp',
      service: 'Meta Ads',
      message: 'Looking for paid social campaign help'
    });
    expect(comp.inquiryForm.valid).toBe(true);
  }, 15000);
});
