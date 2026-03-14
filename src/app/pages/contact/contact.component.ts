import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  
  isSubmitting = false;
  isSuccess = false;

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  submitForm() {
    this.isSubmitting = true;
    
    // Construct the email body
    const subject = `Free Growth Audit Request from ${this.formData.firstName} ${this.formData.lastName}`;
    const body = `
New Audit Request Details:
-------------------------
Name: ${this.formData.firstName} ${this.formData.lastName}
Email: ${this.formData.email}
Phone: ${this.formData.phone}
    `.trim();

    // The user wants to send it to growthmarketingservices1@gmail.com
    const mailtoLink = `mailto:growthmarketingservices1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Simulate API call and success state
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSuccess = true;
      
      // Open the mail client
      window.location.href = mailtoLink;
    }, 1000);
  }
}
