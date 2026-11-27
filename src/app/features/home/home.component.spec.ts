import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home.component';

const validEnquiry = {
  name: 'Jane Doe', business: 'Acme Corp', service: 'Company Website Development',
  phone: '+91 98765 43210', email: 'jane@example.com', message: 'A new site', website: ''
};

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('requests articles for the home preview', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('/api/blogs').flush([]);
    expect(fixture.componentInstance.blogLoading()).toBe(false);
  });

  it('does not send invalid enquiries', () => {
    const { componentInstance: component } = TestBed.createComponent(HomeComponent);
    component.inquiryForm.patchValue({ ...validEnquiry, phone: '123' });
    expect(component.inquiryForm.valid).toBe(false);
    component.submitEnquiry();
    TestBed.inject(HttpTestingController).expectNone('/api/enquiries');
  });

  it('retains input after failure, blocks in-flight resubmission and resets after confirmation', () => {
    const { componentInstance: component } = TestBed.createComponent(HomeComponent);
    const http = TestBed.inject(HttpTestingController);
    component.inquiryForm.patchValue(validEnquiry);
    expect(component.inquiryForm.valid).toBe(true);
    component.submitEnquiry();
    component.submitEnquiry();
    const firstRequest = http.expectOne('/api/enquiries');
    expect(firstRequest.request.body).toEqual(validEnquiry);
    firstRequest.flush({}, { status: 503, statusText: 'Unavailable' });
    expect(component.inquiryForm.getRawValue()).toEqual(validEnquiry);
    component.submitEnquiry();
    http.expectOne('/api/enquiries').flush({ success: true });
    expect(component.inquiryForm.controls.name.value).toBe('');
    expect(component.inquiryForm.controls.service.value).toBe('Social Media Marketing');
  });
});
