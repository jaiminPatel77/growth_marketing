import { Component } from '@angular/core';

@Component({
  selector: 'app-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrls: ['./case-studies.component.scss']
})
export class CaseStudiesComponent {
  
  caseStudies = [
    {
      client: 'TechFlow SaaS',
      industry: 'B2B Software',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      challenge: 'Scaling MQLs without increasing CPA.',
      beforeMetric: '$120 CPA',
      afterMetric: '$65 CPA',
      growthPercentage: 320,
      description: 'By restructuring their paid search architecture and deploying an AI-driven lead scoring system, we doubled lead volume while cutting CPA in half.'
    },
    {
      client: 'ScaleUp Logistics',
      industry: 'Enterprise SaaS',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      challenge: 'Low conversion rate on high-intent traffic.',
      beforeMetric: '1.2% CVR',
      afterMetric: '4.8% CVR',
      growthPercentage: 400,
      description: 'A complete overhaul of their demo request funnel, using heatmap data to remove friction points and implementing personalized landing pages.'
    },
    {
      client: 'FinTech Integrator',
      industry: 'Financial Services',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
      challenge: 'Stagnant organic growth.',
      beforeMetric: '15k Traffic',
      afterMetric: '85k Traffic',
      growthPercentage: 466,
      description: 'Developed a programmatic SEO strategy focusing on comparison keywords and technical API documentation, leading to massive organic growth.'
    }
  ];

}
