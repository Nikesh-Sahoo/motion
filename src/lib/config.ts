export const siteConfig = {
  name: 'Motion',
  founder: 'Sayan',
  tagline: 'BORING GETS SKIPPED. WE MAKE IT UNMISSABLE.',
  supportingStatement:
    'We engineer scroll-stopping video edits built for ruthless retention: viral Reels, cinematic YouTube storytelling, and high-impact brand films designed to turn casual viewers into obsessed followers.',
  description:
    'Motion by Sayan — video editing for creators & brands. Reels, YouTube edits, travel films, and promotional content cut to hold attention.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'sayanedits@gmail.com',
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+91 6370283042',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+916370283042',
    location: process.env.NEXT_PUBLIC_LOCATION || 'Bhubaneswar, India',
  },
  social: {
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
      'https://www.instagram.com/editspherebymayank',
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ||
      'https://www.linkedin.com/in/mayank-bisht',
    upwork:
      process.env.NEXT_PUBLIC_UPWORK_URL ||
      'https://www.upwork.com/freelancers/~0181b827c60b2472a9?mp_source=share',
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  },
};
