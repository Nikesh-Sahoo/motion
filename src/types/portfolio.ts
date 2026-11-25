export type PortfolioCategory =
  | 'all'
  | 'short-form'
  | 'long-form'
  | 'podcast'
  | 'business'
  | 'promotional';

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  duration: string;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  isDemoOrConcept: boolean;
  conceptLabel?: string;
  videoUrl?: string; // external link or embed
  previewType: 'video' | 'concept';
  softwareUsed?: string[];
  gradientTheme: string;
}
