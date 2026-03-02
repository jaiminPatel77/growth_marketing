import { Component } from '@angular/core';

interface Testimonial {
  content: string;
  author: string;
  role: string;
  company: string;
  logoUrl?: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-testimonial-carousel',
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.scss']
})
export class TestimonialCarouselComponent {
  
  testimonials: Testimonial[] = [
    {
      content: "Growth Marketing Service completely transformed our lead generation engine. We saw a 320% increase in qualified pipeline within the first 90 days.",
      author: "Sarah Jenkins",
      role: "CMO",
      company: "TechFlow SaaS",
      avatarUrl: "https://i.pravatar.cc/150?img=47"
    },
    {
      content: "Data-driven marketing at its finest. They didn't just bring us leads; they helped us optimize the entire funnel.",
      author: "Michael Chang",
      role: "Founder",
      company: "ScaleUp B2B",
      avatarUrl: "https://i.pravatar.cc/150?img=11"
    },
    {
      content: "Their AI-powered automation sequences reduced our sales cycle by 40%. The ROI has been incredible.",
      author: "Elena Rodriguez",
      role: "VP of Sales",
      company: "CloudSync",
      avatarUrl: "https://i.pravatar.cc/150?img=32"
    }
  ];

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  setIndex(index: number) {
    this.currentIndex = index;
  }
}
