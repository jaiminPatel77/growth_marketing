import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  constructor(private http: HttpClient) {}

  submitLead(answers: any): Observable<any> {
    const payload = {
      businessName: answers.businessName,
      businessType: answers.businessType,
      hasSocialPage: answers.hasSocialPage,
      marketingBudget: answers.marketingBudget,
      wantTrialInfo: answers.wantTrialInfo,
      trialInterested: answers.trialInterested,
      callTime: answers.callTime,
      phoneNumber: answers.phoneNumber
    };

    // Google Apps Script doPost does not handle CORS preflight OPTIONS requests well.
    // Sending the request as 'text/plain' bypasses the preflight OPTIONS check.
    // The Apps Script code parses it using JSON.parse(e.postData.contents).
    return this.http.post(environment.googleSheetWebhookUrl, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}
