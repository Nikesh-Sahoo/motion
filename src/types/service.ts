export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  included: string[];
  audience: string[];
  useCases: string[];
  icon: string;
  badge?: string;
  turnaroundEstimate: string;
  aspectRatios: string[];
}
