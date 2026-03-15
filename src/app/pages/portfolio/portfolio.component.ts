import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface PortfolioItem {
  id: number;
  title: string;
  image: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  portfolioItems: PortfolioItem[] = [];
  selectedImage: string | null = null;
  isLoading = true;
  
  // Pagination
  currentPage = 1;
  pageSize = 24;
  totalPages = 0;
  pages: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.isLoading = true;
    this.http.get<PortfolioItem[]>('assets/portfolio/images.json').subscribe({
      next: (data) => {
        this.portfolioItems = data;
        this.calculatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading portfolio images:', error);
        this.portfolioItems = [];
        this.isLoading = false;
      }
    });
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.portfolioItems.length / this.pageSize);
    this.updateVisiblePages();
  }

  updateVisiblePages() {
    const maxVisiblePages = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    this.pages = [];
    for (let i = start; i <= end; i++) {
      this.pages.push(i);
    }
  }

  get paginatedItems() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.portfolioItems.slice(startIndex, startIndex + this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateVisiblePages();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
