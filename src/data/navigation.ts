export interface NavLink {
  label: string;
  href: string;
}

export const mainNavLinks: NavLink[] = [
  { label: 'Work', href: '/#work' },
  { label: 'Long Videos', href: '/#long-videos' },
  { label: 'Shorts', href: '/#shorts' },
  { label: 'Services', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/#about' },
  { label: 'Reviews', href: '/#testimonials' },
];

export const footerNavigation = {
  company: [
    { label: 'Work', href: '/#work' },
    { label: 'Services', href: '/#services' },
    { label: 'About', href: '/#about' },
    { label: 'Client Reviews', href: '/#testimonials' },
  ],
  services: [
    { label: 'Short-Form Content', href: '/#shorts' },
    { label: 'YouTube & Long Form', href: '/#long-videos' },
    { label: 'Brand & Promo Edits', href: '/#services' },
    { label: 'Color Grading & Motion', href: '/#services' },
  ],
  connect: [
    { label: 'Start a Project', href: '/#contact' },
    { label: 'Email Sayan', href: 'mailto:sayanedits007@gmail.com' },
    { label: 'Call / WhatsApp', href: 'tel:+916370283042' },
    { label: 'Upwork Profile', href: 'https://www.upwork.com/freelancers/~0181b827c60b2472a9?mp_source=share' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms and Conditions', href: '/terms' },
  ],
};
