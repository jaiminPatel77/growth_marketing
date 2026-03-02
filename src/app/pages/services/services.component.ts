import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services = [
    {
      title: 'Growth Strategy',
      description: 'We architect a full-funnel strategy tailored to your business model, identifying high-leverage growth channels and optimizing unit economics.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>',
      benefits: ['Competitor Analysis', 'Ideal Customer Profile Map', 'Custom Funnel Architecture', 'Unit Economics Optimization']
    },
    {
      title: 'Performance Marketing',
      description: 'Data-driven media buying across search, social, and display networks to drive high-intent leads and predictable revenue.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>',
      benefits: ['Google & Bing Ads Management', 'LinkedIn B2B Lead Gen', 'Retargeting Optimization', 'A/B Testing Creatives']
    },
    {
      title: 'SEO & Content',
      description: 'Capture high-intent organic traffic with technical SEO and thought leadership content that ranks and converts.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>',
      benefits: ['Technical SEO Audits', 'Keyword gap analysis', 'Long-form thought leadership', 'Link building & PR']
    },
    {
      title: 'Funnel Optimization (CRO)',
      description: 'Turn more of your existing traffic into qualified meetings through intense A/B testing and landing page optimization.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>',
      benefits: ['Landing Page Design', 'Heatmap Analysis', 'Multivariate Testing', 'User Experience (UX) Audit']
    },
    {
      title: 'Marketing Automation',
      description: 'Scale your marketing efforts with intelligent workflows that score, nurture, and convert leads seamlessly.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
      benefits: ['CRM Integration (HubSpot, SFDC)', 'Lead Scoring Models', 'Automated Email Nurture', 'Sales Hand-off Processes']
    },
    {
      title: 'AI Marketing Systems',
      description: 'Leverage bespoke AI tools to personalize outreach at scale, predict churn, and optimize bidding in real-time.',
      icon: '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>',
      benefits: ['Predictive Lead Scoring', 'AI Copywriting Tools', 'Dynamic Personalization', 'Programmatic Ad Optimization']
    }
  ];
}
