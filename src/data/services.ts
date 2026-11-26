import { ServiceItem } from '@/types/service';

export const servicesData: ServiceItem[] = [
  {
    id: 'vlog-edits',
    title: 'Vlog Edits',
    slug: 'vlog-edits',
    shortDescription:
      'Story-driven daily, travel, and lifestyle vlog cuts engineered with punchy pacing, music swells, and seamless B-roll.',
    fullDescription:
      'Engaging vlog edits that turn raw handheld or camera footage into binge-worthy episodes with narrative rhythm, sound design, and color consistency.',
    included: [
      'Narrative jump-cut & pacing pass',
      'Music bed & ambient SFX mixing',
      'B-roll transitions & color match',
    ],
    audience: ['Lifestyle & Travel Vloggers', 'Daily Creators', 'Adventure Filmmakers'],
    useCases: ['Travel vlogs', 'Day-in-the-life episodes', 'Creator behind-the-scenes'],
    icon: 'Tv',
    badge: 'Creator Favorite',
    turnaroundEstimate: '24 to 48 hours',
    aspectRatios: ['16:9', '9:16'],
  },
  {
    id: 'instagram-tiktok-reel-edit',
    title: 'Instagram & TikTok Reel Edit',
    slug: 'instagram-tiktok-reel-edit',
    shortDescription:
      'Scroll-stopping vertical reels with 3-second kinetic hooks, beat-synced cuts, captions, and sound hits.',
    fullDescription:
      'High-retention vertical edits built specifically for Instagram Reels and TikTok algorithms—featuring dynamic zoom punch-ins, kinetic typography, and crisp audio.',
    included: [
      'Hook-first 3s visual grab',
      'Beat-synced cuts & kinetic captions',
      'Safe-zone export for IG & TikTok',
    ],
    audience: ['Instagram Creators', 'TikTok Influencers', 'Personal Brands'],
    useCases: ['Talking-head reels', 'Trend & transition edits', 'Viral hook clips'],
    icon: 'Smartphone',
    badge: 'Viral Hook',
    turnaroundEstimate: '24 to 48 hours',
    aspectRatios: ['9:16', '4:5'],
  },
  {
    id: 'youtube-shorts-long-edit',
    title: 'YouTube Shorts & Long Video Edit',
    slug: 'youtube-shorts-long-edit',
    shortDescription:
      'Full-spectrum YouTube editing—from fast-paced Shorts to 15–40 minute retention-engineered long-form videos.',
    fullDescription:
      'Built for watch time, AVD, and subscriber conversion. Includes pattern interrupts, chapter cards, B-roll curation, and Shorts repurposing.',
    included: [
      'Retention pacing & pattern interrupts',
      'Chapter titles, lower-thirds & end cards',
      'Dialogue EQ & 4K master export',
    ],
    audience: ['YouTubers', 'Finance & Tech Channels', 'Gaming & Commentary Creators'],
    useCases: ['Long-form essays & breakdowns', 'YouTube Shorts series', 'Podcast highlights'],
    icon: 'Tv',
    badge: 'High Watch Time',
    turnaroundEstimate: '48 to 72 hours',
    aspectRatios: ['16:9', '9:16'],
  },
  {
    id: 'motion-graphics-edit',
    title: 'Motion Graphics Edit',
    slug: 'motion-graphics-edit',
    shortDescription:
      'Custom After Effects animations, UI callouts, 3D camera keyframes, HUD overlays, and kinetic typography.',
    fullDescription:
      'Sleek vector and 2.5D/3D motion graphics tailored to explain complex ideas visually, elevate explainer videos, and keep viewers locked in.',
    included: [
      'Custom After Effects motion rigs',
      'Animated callouts, charts & UI mockups',
      'Speed-ramped camera keyframing',
    ],
    audience: ['SaaS & Tech Creators', 'Educators', 'Modern Media Channels'],
    useCases: ['Explainer animations', 'Data & chart motion', 'Cyber HUD & kinetic text'],
    icon: 'Sparkles',
    badge: 'After Effects',
    turnaroundEstimate: '48 to 72 hours',
    aspectRatios: ['16:9', '9:16', '1:1'],
  },
  {
    id: 'app-promotion-editing',
    title: 'App Promotion Editing',
    slug: 'app-promotion-editing',
    shortDescription:
      'High-converting mobile & web app launch teasers with smooth UI screen mockups, feature callouts, and store previews.',
    fullDescription:
      'Turn screen recordings and Figma assets into crisp, high-energy app promo videos optimized for App Store, Play Store, Product Hunt, and paid social ads.',
    included: [
      '3D device mockups & UI zoom choreography',
      'Feature highlight callouts & captions',
      'Ad & App Store aspect ratios',
    ],
    audience: ['Indie App Developers', 'Mobile Startups', 'SaaS Founders'],
    useCases: ['App Store preview videos', 'Product Hunt launch clips', 'Meta/TikTok install ads'],
    icon: 'Smartphone',
    badge: 'Launch Ready',
    turnaroundEstimate: '48 to 72 hours',
    aspectRatios: ['16:9', '9:16', '4:5'],
  },
  {
    id: 'brand-promotion-edit',
    title: 'Brand Promotion Edit',
    slug: 'brand-promotion-edit',
    shortDescription:
      'Authority-building brand films, founder stories, and campaign promos aligned cleanly with your brand identity.',
    fullDescription:
      'Polished commercial brand edits combining brand typography, custom LUTs, sound design, and crisp storytelling for agencies and growing businesses.',
    included: [
      'Brand-aligned colors, fonts & LUTs',
      'Commercial sound design & music mix',
      'Multi-platform campaign cutdowns',
    ],
    audience: ['D2C & Lifestyle Brands', 'Creative Agencies', 'Founders & Startups'],
    useCases: ['Brand anthem films', 'Campaign hero ads', 'Event & launch recaps'],
    icon: 'Sparkles',
    badge: 'Commercial',
    turnaroundEstimate: '48 to 72 hours',
    aspectRatios: ['16:9', '9:16', '1:1'],
  },
  {
    id: 'product-promotion-edit',
    title: 'Product Promotion Edit',
    slug: 'product-promotion-edit',
    shortDescription:
      'Punchy e-commerce & physical/digital product showcases built to spotlight features and drive immediate conversions.',
    fullDescription:
      'Dynamic product commercial edits featuring speed ramps, macro B-roll pacing, feature callouts, and CTA end-frames built for higher ROAS.',
    included: [
      'Speed-ramp & macro cut pacing',
      'Benefit callouts & price/CTA overlays',
      'Paid ad hook variations',
    ],
    audience: ['E-Commerce Stores', 'D2C Brands', 'Performance Marketers'],
    useCases: ['Amazon & Shopify product ads', 'Unboxing & launch reels', 'Performance creatives'],
    icon: 'Sparkles',
    badge: 'High CTR',
    turnaroundEstimate: '24 to 72 hours',
    aspectRatios: ['9:16', '4:5', '16:9'],
  },
  {
    id: 'cinematic-video-edit',
    title: 'Cinematic Video Edit',
    slug: 'cinematic-video-edit',
    shortDescription:
      'Film-grade storytelling with DaVinci Resolve color grading, atmospheric soundscapes, and emotional pacing.',
    fullDescription:
      'Atmospheric, cinema-inspired edits for travel films, short documentaries, real estate showcases, and music/mood pieces with filmic LUTs and risers.',
    included: [
      'DaVinci Resolve Rec.709 & filmic grade',
      'Layered soundscape, risers & whooshes',
      'Anamorphic / 4K DCI finishing',
    ],
    audience: ['Filmmakers', 'Travel Creators', 'Luxury & Real Estate Brands'],
    useCases: ['Travel & adventure films', 'Luxury property tours', 'Short documentaries'],
    icon: 'Tv',
    badge: '4K Cinema',
    turnaroundEstimate: '48 to 96 hours',
    aspectRatios: ['16:9', '2.39:1', '9:16'],
  },
  {
    id: 'titlecard-video-edit',
    title: 'Titlecard Video Edit',
    slug: 'titlecard-video-edit',
    shortDescription:
      'Custom animated title cards, intro sequences, chapter bumpers, and broadcast-style typography openers.',
    fullDescription:
      'Bespoke animated titlecard sequences and intro/outro bumpers that give your channel, film, or brand campaign an unmistakable signature opening.',
    included: [
      'Custom kinetic titlecard & intro animation',
      'Matching SFX stinger & impact mix',
      'Reusable MOGRT / alpha-channel exports',
    ],
    audience: ['YouTube Series Creators', 'Podcast Shows', 'Event & Film Producers'],
    useCases: ['Show intro titlecards', 'Chapter & segment bumpers', 'Event opener screens'],
    icon: 'Sparkles',
    badge: 'Custom Intro',
    turnaroundEstimate: '24 to 48 hours',
    aspectRatios: ['16:9', '9:16'],
  },
  {
    id: 'premium-photo-edit',
    title: 'Premium Photo Edit',
    slug: 'premium-photo-edit',
    shortDescription:
      'High-end retouching, Lightroom/Photoshop color grading, thumbnail composites, and social visual polish.',
    fullDescription:
      'Studio-grade photo editing and visual compositing for creator portraits, product shots, YouTube thumbnails, and brand campaign stills.',
    included: [
      'Pro color grading & skin/detail retouch',
      'Lighting, glow & composite cleanup',
      'High-res print & social exports',
    ],
    audience: ['Creators & Influencers', 'Product Brands', 'YouTube Channels'],
    useCases: ['Creator portraits & press kits', 'Product photography polish', 'High-CTR thumbnails'],
    icon: 'Sparkles',
    badge: 'Studio Retouch',
    turnaroundEstimate: '12 to 24 hours',
    aspectRatios: ['4:5', '16:9', '1:1'],
  },
  {
    id: 'self-reference-service',
    title: 'Self Reference Service',
    slug: 'self-reference-service',
    shortDescription:
      'Send your own reference video, reel, or edit link—we match its exact pacing, transitions, typography, and vibe.',
    fullDescription:
      'Have a specific creator, ad, or visual style you want replicated for your footage? Share any self-reference URL in your brief and we engineer your edit to match that exact benchmark.',
    included: [
      'Frame-by-frame reference style breakdown',
      'Matched typography, pacing & SFX feel',
      'Tailored to your raw footage & brand',
    ],
    audience: ['Creators With a Target Style', 'Brands Matching Winning Ads', 'Agencies'],
    useCases: ['Matching a viral reference reel', 'Recreating a competitor ad pacing', 'Custom style briefs'],
    icon: 'Sparkles',
    badge: 'Self Reference Available',
    turnaroundEstimate: '24 to 72 hours',
    aspectRatios: ['16:9', '9:16', '4:5', '1:1'],
  },
];
