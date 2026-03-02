import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  clientLogos = [
    { name: 'Acme Corp', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Global Tech', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Innovate AI', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { name: 'CloudScale', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  ];

  processSteps = [
    { title: 'Discover', description: 'Deep-dive into your analytics, funnel, and current market position.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { title: 'Strategize', description: 'Develop a tailored growth model based on data and competitive intelligence.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { title: 'Execute', description: 'Deploy campaigns, automation flows, and conversion optimizations.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Scale', description: 'Analyze performance data to double-down on winning strategies.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }
  ];

}
