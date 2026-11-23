export interface BlogSection {
  heading: string;
  paragraph: string;
}

export type BlogCategory = 'Marketing' | 'Social Media' | 'Creative';
export type BlogColor = 'orange' | 'teal' | 'gold' | 'navy' | 'coral' | 'mint';

export interface BlogPost {
  id: string;
  category: BlogCategory;
  color: BlogColor;
  icon: string;
  title: string;
  excerpt: string;
  sections: BlogSection[];
}

