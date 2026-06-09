import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services = [
    {
      title: 'Starter Plan',
      description: 'Perfect for new businesses who want basic social media presence.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
      benefits: [
        '10 Social Media Posts',
        '03 Reels',
        'Social Media Page Management',
        'Story, Caption, Hashtag & Basic Branding',
        'Social Media Platform Boosting',
        'Meta Ads Campaign Setup',
        'Ad Budget Extra'
      ],
      price: '₹3,999',
      highlighted: false,
      badge: ''
    },
    {
      title: 'Growth Plan',
      description: 'Best for businesses who want regular content + better branding.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
      benefits: [
        '15 Social Media Posts',
        '06 Reels',
        'Meta Ads Campaign Setup & Management',
        'Social Media Platform Handling',
        'Story, Caption, Hashtag & Branding',
        'Google Business Page Setup',
        'Content Creation & Monthly Strategy',
        'Social Media Page Setup',
        'Festival Posts & Stories',
        'Ad Budget Extra'
      ],
      price: '₹5,999',
      highlighted: true,
      badge: 'Most Popular'
    },
    {
      title: 'Premium Plan',
      description: 'Complete social media growth package for serious business promotion.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>',
      benefits: [
        '15 Social Media Posts',
        '03 Carousel / Creative Posts',
        '08 Reels',
        'Meta Ads Campaign Setup & Management',
        'Lead Generation & Branding Focus',
        'Social Media Page Handling',
        'Stories, Captions & Hashtags',
        'Google Business Page Setup',
        'Content Creation & Content Strategy',
        'Social Media Account Management',
        'Monthly Content Calendar Planning',
        'Business Performance Improvement Support',
        'Profile Creation / Optimization',
        'Festival Posts & Stories',
        'Ad Budget Extra'
      ],
      price: '₹9,999',
      highlighted: false,
      badge: 'Best Value'
    }
  ];
}
