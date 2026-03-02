import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  coreValues = [
    { title: 'Data Over Opinion', description: 'Every decision we make is backed by rigorous data analysis, not gut feeling.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { title: 'Extreme Ownership', description: 'We treat your business like our own. Total transparency and accountability.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Continuous Evolution', description: 'The marketing landscape shifts daily. We are obsessed with staying ahead of the curve.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Sustainable Growth', description: 'We don`t do growth hacks that burn pipelines. We build scalable systems.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  team = [
    { name: 'Alex Sterling', role: 'Founder & CEO', image: 'https://i.pravatar.cc/300?img=11', bio: 'Former Head of Growth at multiple unicorn startups. Passionate about systems thinking.' },
    { name: 'Marcus Chen', role: 'VP of Performance Marketing', image: 'https://i.pravatar.cc/300?img=12', bio: 'Managed over $50M in ad spend across B2B SaaS and enterprise tech.' },
    { name: 'Sophia Patel', role: 'Head of SEO', image: 'https://i.pravatar.cc/300?img=5', bio: 'Technical SEO master who has driven millions of organic sessions for B2B brands.' },
    { name: 'David Kim', role: 'Lead Data Scientist', image: 'https://i.pravatar.cc/300?img=15', bio: 'Builds predictive models and custom analytics pipelines to uncover hidden revenue.' }
  ];

}
