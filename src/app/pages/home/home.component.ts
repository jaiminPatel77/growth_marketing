import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  clientLogos = [
    { name: 'Logo 1', src: 'assets/client_logos/Logo(1).png' },
    { name: 'Logo 2', src: 'assets/client_logos/Logo(2).png' },
    { name: 'Logo 3', src: 'assets/client_logos/Logo(3).png' },
    { name: 'Logo 4', src: 'assets/client_logos/Logo(4).png' },
    { name: 'Logo 6', src: 'assets/client_logos/Logo(6).png' },
    { name: 'Logo 7', src: 'assets/client_logos/Logo(7).png' },
    { name: 'Logo 8', src: 'assets/client_logos/Logo(8).png' },
    { name: 'Logo 9', src: 'assets/client_logos/Logo(9).png' },
    { name: 'Logo 10', src: 'assets/client_logos/Logo(10).png' },
    { name: 'Logo 11', src: 'assets/client_logos/Logo(11).png' },
    { name: 'Logo 12', src: 'assets/client_logos/Logo(12).png' },
    { name: 'Logo 13', src: 'assets/client_logos/Logo(13).png' },
    { name: 'Logo 14', src: 'assets/client_logos/Logo(14).png' },
    { name: 'Logo 15', src: 'assets/client_logos/Logo(15).png' },
    { name: 'Logo 16', src: 'assets/client_logos/Logo(16).png' },
  ];

  processSteps = [
    { title: 'Discover', description: 'Deep-dive into your analytics, funnel, and current market position.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { title: 'Strategize', description: 'Develop a tailored growth model based on data and competitive intelligence.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { title: 'Execute', description: 'Deploy campaigns, automation flows, and conversion optimizations.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Scale', description: 'Analyze performance data to double-down on winning strategies.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }
  ];

}
