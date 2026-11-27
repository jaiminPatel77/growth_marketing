export interface BlogSummary {
  id: string;
  slug: string;
  category: string;
  color: string;
  icon: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  author: string;
  publishedAt: string;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
}

export interface BlogPost extends BlogSummary {
  content: string;
}
