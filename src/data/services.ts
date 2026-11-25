import { ServiceItem } from '@/types/service';

export const servicesData: ServiceItem[] = [
  {
    id: 'short-form',
    title: 'Short-Form Content',
    slug: 'short-form',
    shortDescription:
      'Fast, punchy edits for Instagram Reels, YouTube Shorts, TikTok, ads, and creator clips.',
    fullDescription:
      'Fast-paced, hook-driven vertical edits engineered for high audience retention across Instagram Reels, YouTube Shorts, TikTok, and paid social ads.',
    included: [
      'Hook-first structure',
      'Captions & sound design',
      'Platform-ready exports',
      'Dynamic punch-ins & zooms',
      'B-roll inserts & motion graphics',
      'Audio mastering for mobile speakers',
    ],
    audience: [
      'Instagram Creators & Influencers',
      'YouTube Shorts Channels',
      'E-commerce & DTC Brands',
      'Coaches & Agency Founders',
    ],
    useCases: [
      'Talking-head reels with kinetic captions',
      'Viral hook clip extractions from podcasts',
      'Real estate vertical walkthroughs',
      'High-CTR paid social video ads',
    ],
    icon: 'Smartphone',
    badge: 'Popular',
    turnaroundEstimate: 'Typically 24 to 48 hours',
    aspectRatios: ['9:16', '4:5'],
  },
  {
    id: 'long-form',
    title: 'YouTube & Long Form',
    slug: 'long-form',
    shortDescription:
      'Clean narrative edits for talking-head videos, vlogs, travel films, interviews, and explainers.',
    fullDescription:
      'Engaging long-form YouTube storytelling built for watch time. We structure pacing, eliminate pauses, curate cinematic b-roll, and polish audio to maximize average view duration.',
    included: [
      'Story pacing & narrative structure',
      'B-roll selection & archival footage curation',
      'Music, mix & polish',
      'Chapter titles, lower-thirds & cards',
      'Dialogue EQ & background noise reduction',
      '4K / 1080p master export in 16:9',
    ],
    audience: [
      'YouTubers & Video Essayists',
      'Travel Filmmakers & Vloggers',
      'Finance & Business Explainers',
      'Gaming Creators & Streamers',
    ],
    useCases: [
      'Financial storytelling deep-dives',
      'Travel films with emotional pacing',
      'Fast-paced gameplay edits with memes & SFX',
      'Cinematic architectural & real estate films',
    ],
    icon: 'Tv',
    badge: 'High Watch Time',
    turnaroundEstimate: 'Typically 48 to 72 hours',
    aspectRatios: ['16:9'],
  },
  {
    id: 'brand-promo',
    title: 'Brand & Promo Edits',
    slug: 'brand-promo',
    shortDescription:
      'Launch videos, product promos, event recaps, and agency client edits that feel premium.',
    fullDescription:
      'High-production promotional edits crafted to elevate brand authority. From product launch teasers to agency client deliverables, we combine color grading, dynamic motion design, and seamless cuts.',
    included: [
      'Color grading (Rec.709 & custom LUTs)',
      'Motion graphics & animated titles',
      'Revision-friendly workflow',
      'Sound design & commercial music licensing',
      'Multi-platform export formats',
      'Brand guideline color harmony',
    ],
    audience: [
      'Startups & Small Brands',
      'Creative & Marketing Agencies',
      'Cafes, Hospitality & Lifestyle Brands',
      'Corporate Product Teams',
    ],
    useCases: [
      'Product launch & feature reveal teasers',
      'Café & hospitality brand stories',
      'Event recaps & commercial promos',
      'High-converting marketing reels',
    ],
    icon: 'Sparkles',
    badge: 'Premium Grade',
    turnaroundEstimate: '48 to 72 hours depending on scope',
    aspectRatios: ['16:9', '9:16', '1:1'],
  },
];
