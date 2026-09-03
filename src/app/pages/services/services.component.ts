import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services = [
    {
      title: 'Basic',
      description: 'A strong social media foundation for startups and growing local businesses.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
      benefits: [
        '8 High Quality Posts',
        '2 Stories',
        '4 Reels',
        'Complete Page Management',
        'Meta Ads',
        'Lead Generation',
        'Monthly Performance Report'
      ],
      price: '₹7,999',
      highlighted: false,
      badge: 'Best for Startup'
    },
    {
      title: 'Standard',
      description: 'Our growth-focused package for businesses ready to reach and convert more customers.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
      benefits: [
        '10 High Quality Posts',
        '4 Stories',
        '6 Reels',
        'Complete Page Management',
        'Meta Ads',
        'Lead Generation & Retargeting',
        'Monthly Analytics Dashboard'
      ],
      price: '₹11,999',
      highlighted: true,
      badge: 'Best for Growth'
    },
    {
      title: 'Premium',
      description: 'Full-funnel marketing and priority strategy support for businesses ready to scale.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>',
      benefits: [
        '12 High Quality Posts',
        '6 Stories',
        '8 Reels',
        'Full Page Management',
        'Meta Ads + Google Ads',
        'Lead Generation & Sales Funnels',
        'Priority Support & Strategy Call'
      ],
      price: '₹15,999',
      highlighted: false,
      badge: 'Best for Scaling'
    }
  ];
}
