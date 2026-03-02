import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  
  categories = ['All', 'Growth Strategy', 'SEO', 'Paid Media', 'Automation', 'CRO'];
  activeCategory = 'All';

  posts = [
    {
      title: 'The Post-Cookie Era: How to Build a First-Party Data Strategy',
      excerpt: 'With third-party cookies disappearing, relying on rented audiences is riskier than ever. Here is how B2B companies are pivoting to owned audiences.',
      category: 'Growth Strategy',
      date: 'Oct 12, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: true
    },
    {
      title: 'Mastering LinkedIn Ads for Enterprise B2B Lead Gen',
      excerpt: 'Advanced tactics for targeting decision-makers, optimizing ad spend, and driving high-quality MQLs through LinkedIn.',
      category: 'Paid Media',
      date: 'Sep 28, 2026',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'How to Implement Predictive Lead Scoring with AI',
      excerpt: 'Stop passing every lead to sales. Learn how to train ML models on your CRM data to identify accounts with the highest propensity to buy.',
      category: 'Automation',
      date: 'Sep 15, 2026',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    },
    {
      title: 'A Technical Guide to Programmatic SEO',
      excerpt: 'Generating thousands of highly relevant landing pages using database-driven content to dominate long-tail search queries.',
      category: 'SEO',
      date: 'Aug 30, 2026',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      featured: false
    }
  ];

  get displayedPosts() {
    if (this.activeCategory === 'All') {
      return this.posts.filter(p => !p.featured); // Filter out featured from grid if handled separately, or keep them all. Let's keep all except the strictly featured one if we have a featured section. Wait, let's just return filtered.
    }
    return this.posts.filter(p => p.category === this.activeCategory);
  }

  get featuredPost() {
    return this.posts.find(p => p.featured) || this.posts[0];
  }
}
