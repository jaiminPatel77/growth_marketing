import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services = [
    {
      title: 'Starter Growth Plan',
      description: 'The complete social media management solution for local businesses. We handle everything from content creation to lead generation.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>',
      benefits: [
        '15 Professional Social Media Posts',
        '4 Short Video Reels',
        'Meta Ads Management (Ad Spend Extra)',
        'Facebook + Instagram Page Management',
        'Story Posting, Captions, Hashtags & Branding',
        'Google My Business Listing Setup'
      ],
      price: '₹3,999'
    }
  ];
}
