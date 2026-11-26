import type { Metadata } from 'next';
import './globals.css';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Motionxyne — Creative Post-Production & Video Editing',
    template: '%s | Motionxyne',
  },
  description:
    'Motionxyne by Sayan — creative post-production & video editing studio. High-retention reels, YouTube edits, travel films, and commercial brand content cut to hold attention.',
  keywords: [
    'Motionxyne',
    'Motionxyne post-production',
    'Motionxyne video editing',
    'Sayan',
    'video editing agency India',
    'YouTube video editor',
    'reels editing',
    'creative post-production',
    'retention video editing',
    'short form editor',
  ],
  authors: [{ name: 'Sayan' }],
  creator: 'Motionxyne',
  publisher: 'Motionxyne',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: 'Motionxyne — Creative Post-Production & Video Editing',
    description:
      'High-retention reels, YouTube edits, travel films, and commercial brand content cut to hold attention. By Sayan at Motionxyne.',
    siteName: 'Motionxyne',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motionxyne — Creative Post-Production & Video Editing',
    description:
      'Reels, travel films, YouTube edits, and brand content cut to hold attention. Motionxyne.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#05050A] text-[#F4F6FF] selection:bg-[#FF007F] selection:text-[#00F0FF] cyber-scanlines">
        {/* Cyberpunk Neon Accent Bar */}
        <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] shadow-[0_0_16px_rgba(0,240,255,0.65)] z-[60]" />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
