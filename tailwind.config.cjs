/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0D',
        void: '#0B0B0D',
        panel: '#15151B',
        'panel-2': '#1B1B22',
        bone: '#F3EFE7',
        ash: '#97959F',
        orange: {
          DEFAULT: '#FF6B35',
          glow: 'rgba(255, 107, 53, 0.45)',
          light: '#FF8859',
        },
        teal: {
          DEFAULT: '#19C3B8',
          glow: 'rgba(25, 195, 184, 0.4)',
          light: '#42E3D8',
        },
        line: 'rgba(243, 239, 231, 0.10)',
        'line-strong': 'rgba(243, 239, 231, 0.20)',
        // Retain compatibility mapping
        surface: '#15151B',
        'surface-hover': '#1B1B22',
        border: 'rgba(243, 239, 231, 0.12)',
        'accent-purple': '#FF6B35', // mapped to brand orange
        'accent-cyan': '#19C3B8',   // mapped to brand teal
      },
      fontFamily: {
        display: [
          'Anton',
          'Impact',
          '-apple-system',
          'sans-serif',
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'glow-orange': '0 14px 30px -10px rgba(255, 107, 53, 0.55)',
        'glow-teal': '0 14px 30px -10px rgba(25, 195, 184, 0.45)',
        card: '0 1px 0 rgba(11,11,13,.08), 0 18px 40px -34px rgba(0,0,0,.45)',
        'card-hover': '0 20px 45px -35px rgba(255,107,53,.55)',
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
        scrub: 'scrub 7s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrub: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
};
