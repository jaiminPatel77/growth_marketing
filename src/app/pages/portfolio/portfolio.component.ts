import { Component } from '@angular/core';

interface PortfolioItem {
  id: number;
  title: string;
  category: 'Food' | 'Jewellery';
  image: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {
  categories = ['All', 'Food', 'Jewellery'];
  activeCategory = 'All';
  selectedImage: string | null = null;

  portfolioItems: PortfolioItem[] = [
    { id: 1, title: 'Gourmet Pasta Creative', category: 'Food', image: 'assets/portfolio/food/food_creative_1.png' },
    { id: 2, title: 'Special Latte Story', category: 'Food', image: 'assets/portfolio/food/food_creative_2.png' },
    { id: 3, title: 'Luxury Diamond Ad', category: 'Jewellery', image: 'assets/portfolio/jewellery/jewellery_creative_1.png' },
    { id: 4, title: 'Traditional Jhumka Post', category: 'Jewellery', image: 'assets/portfolio/jewellery/jewellery_creative_2.png' }
  ];

  get filteredItems() {
    return this.activeCategory === 'All' 
      ? this.portfolioItems 
      : this.portfolioItems.filter(item => item.category === this.activeCategory);
  }

  getCategoryCount(category: string) {
    return category === 'All' 
      ? this.portfolioItems.length 
      : this.portfolioItems.filter(item => item.category === category).length;
  }

  setCategory(category: string) {
    this.activeCategory = category;
  }

  openLightbox(image: string) {
    this.selectedImage = image;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.selectedImage = null;
    document.body.style.overflow = 'auto';
  }
}
