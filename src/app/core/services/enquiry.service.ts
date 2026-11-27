import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { timeout } from 'rxjs';

export interface Enquiry {
  name: string;
  phone: string;
  email: string;
  business: string;
  service: string;
  message: string;
  website: string;
}

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private readonly http = inject(HttpClient);

  submit(enquiry: Enquiry) {
    return this.http.post<{ success: true }>('/api/enquiries', enquiry).pipe(timeout(45000));
  }
}
