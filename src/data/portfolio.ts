import { PortfolioItem, PortfolioCategory } from '@/types/portfolio';

export interface LongVideoItem {
  id: string;
  title: string;
  category: string;
  embedUrl: string;
  aspectRatio: string;
}

export interface ShortVideoItem {
  id: string;
  title: string;
  subtitle: string;
  embedUrl: string;
  shortUrl: string;
}

export interface ClientReview {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

// 4 Long Videos from editshphere.in
export const longVideos: LongVideoItem[] = [
  {
    id: 'long-finance',
    title: 'Financial Storytelling',
    category: 'Finance YouTube video edit',
    embedUrl: 'https://www.youtube.com/embed/7QR_cYQ75KM',
    aspectRatio: '16/9',
  },
  {
    id: 'long-vlog',
    title: 'Lifestyle Edits',
    category: 'Vlog YouTube video edit',
    embedUrl: 'https://www.youtube.com/embed/SnnbGn370hM?si=tYw3taJgmzSFvAv6',
    aspectRatio: '16/9',
  },
  {
    id: 'long-gaming',
    title: 'Gameplay Edits',
    category: 'Gaming YouTube video edit',
    embedUrl: 'https://www.youtube.com/embed/l37Cpdjkobs?si=BMOC0DBDCcLdyfMP',
    aspectRatio: '16/9',
  },
  {
    id: 'long-realestate',
    title: 'Real Estate Films',
    category: 'Real estate YouTube video edit',
    embedUrl: 'https://www.youtube.com/embed/r1Rlxuzob-0',
    aspectRatio: '16/9',
  },
];

// 6 Shorts & Reels from editshphere.in
export const shortVideos: ShortVideoItem[] = [
  {
    id: 'short-1',
    title: 'Talking Head Short',
    subtitle: 'Captions · Punch-ins',
    embedUrl: 'https://www.youtube.com/embed/0nGc2bvLCPo',
    shortUrl: 'https://youtube.com/shorts/0nGc2bvLCPo',
  },
  {
    id: 'short-2',
    title: 'Finance Hook Short',
    subtitle: 'Graphs · B-roll',
    embedUrl: 'https://www.youtube.com/embed/-p6Ojv2QHIc',
    shortUrl: 'https://youtube.com/shorts/-p6Ojv2QHIc',
  },
  {
    id: 'short-3',
    title: 'Gaming Clip Short',
    subtitle: 'Memes · SFX',
    embedUrl: 'https://www.youtube.com/embed/AP7IkraqWRY',
    shortUrl: 'https://youtube.com/shorts/AP7IkraqWRY',
  },
  {
    id: 'short-4',
    title: 'Real Estate Tour Short',
    subtitle: 'Speed ramps · Text',
    embedUrl: 'https://www.youtube.com/embed/LBFCAQlvlX0',
    shortUrl: 'https://youtube.com/shorts/LBFCAQlvlX0',
  },
  {
    id: 'short-5',
    title: 'Vlog Moment Short',
    subtitle: 'Story · Music',
    embedUrl: 'https://www.youtube.com/embed/kBLC3txG5aE',
    shortUrl: 'https://youtube.com/shorts/kBLC3txG5aE',
  },
  {
    id: 'short-6',
    title: 'Ad Creative Short',
    subtitle: 'CTA · Retention',
    embedUrl: 'https://www.youtube.com/embed/jM3jmZ-vhoI',
    shortUrl: 'https://youtube.com/shorts/jM3jmZ-vhoI',
  },
];

export const portfolioCategories = [
  { id: 'all', label: 'All Projects' },
  { id: 'short-form', label: 'Short-Form' },
  { id: 'long-form', label: 'Long-Form' },
  { id: 'podcast', label: 'Podcast' },
  { id: 'business', label: 'Business' },
  { id: 'promotional', label: 'Promotional' },
] as const;

export const portfolioProjects: PortfolioItem[] = [
  {
    id: 'pf-long-finance',
    title: 'Financial Storytelling',
    category: 'long-form',
    categoryLabel: 'Long-Form',
    shortDescription:
      'Fast-paced financial breakdown featuring data visualizations, kinetic graphs, and punchy hook pacing for maximum watch time.',
    fullDescription:
      'Built for finance and educational creators. Features narrative pacing, motion infographic callouts, dialogue leveling, and retention edits.',
    tags: ['YouTube 16:9', 'Financial Storytelling', 'Motion Infographics', 'Retention'],
    duration: '10:45',
    aspectRatio: '16:9',
    isDemoOrConcept: false,
    previewType: 'video',
    videoUrl: 'https://www.youtube.com/embed/7QR_cYQ75KM',
    softwareUsed: ['Adobe Premiere Pro', 'After Effects'],
    gradientTheme: 'from-[#FF6B35] via-[#15151B] to-[#19C3B8]',
  },
  {
    id: 'pf-long-vlog',
    title: 'Lifestyle & Travel Edits',
    category: 'long-form',
    categoryLabel: 'Long-Form',
    shortDescription:
      'Cinematic travel and lifestyle narrative edit with ambient sound design, color grade, and seamless musical cuts.',
    fullDescription:
      'Turn raw footage into an emotional visual journey. Features custom color correction, sound design transients, and beat matching.',
    tags: ['Travel Film', 'Story Pacing', 'Sound Design', 'Color Grade'],
    duration: '08:20',
    aspectRatio: '16:9',
    isDemoOrConcept: false,
    previewType: 'video',
    videoUrl: 'https://www.youtube.com/embed/SnnbGn370hM?si=tYw3taJgmzSFvAv6',
    softwareUsed: ['DaVinci Resolve', 'Premiere Pro'],
    gradientTheme: 'from-[#19C3B8] via-[#15151B] to-[#FF6B35]',
  },
  {
    id: 'pf-short-hook',
    title: 'Talking Head Short · Captions & Punch-ins',
    category: 'short-form',
    categoryLabel: 'Short-Form',
    shortDescription:
      'Vertical edit engineered for Instagram Reels and YouTube Shorts with dynamic styled subtitles and rapid punch-ins.',
    fullDescription:
      'Hook-first vertical video with active-word highlighted captions, sound effects, and zooms that stop the scroll within 3 seconds.',
    tags: ['Vertical 9:16', 'Captions', 'Punch-ins', 'High Retention'],
    duration: '0:45',
    aspectRatio: '9:16',
    isDemoOrConcept: false,
    previewType: 'video',
    videoUrl: 'https://www.youtube.com/embed/0nGc2bvLCPo',
    softwareUsed: ['Premiere Pro', 'After Effects'],
    gradientTheme: 'from-[#FF6B35] via-[#1B1B22] to-[#19C3B8]',
  },
  {
    id: 'pf-short-finance',
    title: 'Finance Hook Short · Graphs & B-roll',
    category: 'short-form',
    categoryLabel: 'Short-Form',
    shortDescription:
      'Vertical short explaining financial concepts through overlaid animated graphs and dynamic b-roll inserts.',
    fullDescription:
      'Vertical format designed to distill complex economic and business insights into 50 seconds of engaging visual content.',
    tags: ['Graphs', 'B-roll', 'Finance', '9:16'],
    duration: '0:50',
    aspectRatio: '9:16',
    isDemoOrConcept: false,
    previewType: 'video',
    videoUrl: 'https://www.youtube.com/embed/-p6Ojv2QHIc',
    softwareUsed: ['After Effects', 'Premiere Pro'],
    gradientTheme: 'from-[#19C3B8] via-[#15151B] to-[#FF6B35]',
  },
  {
    id: 'pf-long-realestate',
    title: 'Real Estate Showcase Films',
    category: 'business',
    categoryLabel: 'Business',
    shortDescription:
      'Architectural walkthrough video combining smooth speed ramping, stabilizing, and high-end color grading.',
    fullDescription:
      'Promotional real estate film showcasing architectural luxury through fluid camera movement, stabilization, and warm color tones.',
    tags: ['Real Estate', 'Speed Ramps', 'Color Grading', '16:9'],
    duration: '03:15',
    aspectRatio: '16:9',
    isDemoOrConcept: false,
    previewType: 'video',
    videoUrl: 'https://www.youtube.com/embed/r1Rlxuzob-0',
    softwareUsed: ['DaVinci Resolve Studio'],
    gradientTheme: 'from-[#FF6B35] via-[#15151B] to-[#19C3B8]',
  },
  {
    id: 'pf-short-ad',
    title: 'Ad Creative Short · CTA & Retention',
    category: 'promotional',
    categoryLabel: 'Promotional',
    shortDescription:
      'High-converting performance marketing short built with scroll-stopping hooks and clear calls to action.',
    fullDescription:
      'Performance creative designed for paid Meta and TikTok ads to drive high click-through rates and customer conversions.',
    tags: ['Ad Creative', 'CTA', 'Retention', 'Paid Social'],
    duration: '0:35',
    aspectRatio: '9:16',
    isDemoOrConcept: false,
    previewType: 'video',
    videoUrl: 'https://www.youtube.com/embed/jM3jmZ-vhoI',
    softwareUsed: ['Premiere Pro', 'After Effects'],
    gradientTheme: 'from-[#19C3B8] via-[#15151B] to-[#FF6B35]',
  },
];

// 6 Client Testimonials from editshphere.in
export const clientTestimonials: ClientReview[] = [
  {
    id: 'review-1',
    name: 'Sarah Mitchell',
    role: 'Café Owner',
    quote:
      "We weren't just looking for someone to edit videos—we needed content that actually got people interested in our brand. The reels Sayan delivered felt professional, engaging, and perfectly matched our vibe. We noticed higher engagement almost immediately and the whole process was incredibly smooth.",
    rating: 5,
  },
  {
    id: 'review-2',
    name: 'Daniel Carter',
    role: 'Travel Content Creator',
    quote:
      'I sent over hours of footage with very little direction and got back a film that felt cinematic, emotional, and polished. The pacing, music, and storytelling turned simple clips into something people genuinely wanted to watch.',
    rating: 5,
  },
  {
    id: 'review-3',
    name: 'James Walker',
    role: 'Founder & Creator',
    quote:
      "What stood out most wasn't the editing—it was the understanding of audience retention. Every cut felt intentional. The final video kept viewers engaged and represented my brand better than I imagined.",
    rating: 5,
  },
  {
    id: 'review-4',
    name: 'Alex Thompson',
    role: 'Marketing Lead',
    quote:
      "Reliable, fast, and incredibly easy to work with. We trusted Sayan with multiple client projects, and he consistently delivered high-quality edits that matched each brand's style while meeting tight deadlines.",
    rating: 5,
  },
  {
    id: 'review-5',
    name: 'Rachel Morgan',
    role: 'Brand Manager',
    quote:
      'The difference between average content and great content is attention to detail. From storytelling to sound design, every part of the edit felt premium. The final result looked like something from a much larger production team.',
    rating: 5,
  },
  {
    id: 'review-6',
    name: 'Michael Reed',
    role: 'Creative Director',
    quote:
      'Great footage gets views. Great storytelling gets results. Sayan understands the difference.',
    rating: 5,
  },
];
