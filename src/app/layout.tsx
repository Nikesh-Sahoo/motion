import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Motion — Video Editing & Creative Post-Production',
    template: '%s | Motion',
  },
  description:
    'Motion by Sayan — reels, travel films, YouTube edits, and brand content cut to hold attention.',
  keywords: [
    'Motion',
    'Motion video editing',
    'Sayan',
    'video editing',
    'YouTube video editor',
    'reels editing',
    'creative post-production',
    'retention video editing',
    'short form editor',
  ],
  authors: [{ name: 'Sayan' }],
  creator: 'Motion',
  publisher: 'Motion',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: 'Motion — Video Editing & Creative Post-Production',
    description:
      'Reels, travel films, YouTube edits, and brand content cut to hold attention. By Sayan.',
    siteName: 'Motion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motion — Video Editing & Creative Post-Production',
    description:
      'Reels, travel films, YouTube edits, and brand content cut to hold attention.',
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
      <body className="min-h-screen flex flex-col bg-[#0B0B0D] text-[#F3EFE7] selection:bg-[#FF9933] selection:text-[#0B0B0D]">
        {/* Indian Flag Tri-color Accent Bar */}
        <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] z-[60]" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
