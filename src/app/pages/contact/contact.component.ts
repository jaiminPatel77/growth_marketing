import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  
  isSubmitting = false;
  isSuccess = false;

  submitForm(event: Event) {
    event.preventDefault();
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSuccess = true;
    }, 1500);
  }

  // Generate some mock calendar days
  get calendarDays() {
    const days = [];
    // Just mock 35 days for a calendar grid
    for(let i = 1; i <= 31; i++) {
       days.push({
         day: i,
         available: i % 3 !== 0 && i % 7 !== 0 && i % 7 !== 6 // Random availability logic
       });
    }
    return days;
  }
}
