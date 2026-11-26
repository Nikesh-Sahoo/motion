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
        background: '#05050A',
        'background-alt': '#090A14',
        void: '#05050A',
        panel: '#0D0E1A',
        'panel-2': '#141528',
        bone: '#F4F6FF',
        ash: '#8A94B8',
        orange: {
          DEFAULT: '#FF007F',
          glow: 'rgba(255, 0, 127, 0.45)',
          light: '#FF4DA6',
        },
        teal: {
          DEFAULT: '#00F0FF',
          glow: 'rgba(0, 240, 255, 0.45)',
          light: '#66F7FF',
        },
        cyber: {
          cyan: '#00F0FF',
          pink: '#FF007F',
          yellow: '#FCEE0A',
          violet: '#9D4EDD',
        },
        line: 'rgba(0, 240, 255, 0.14)',
        'line-strong': 'rgba(0, 240, 255, 0.30)',
        surface: '#0D0E1A',
        'surface-hover': '#141528',
        border: 'rgba(0, 240, 255, 0.16)',
        'accent-purple': '#FF007F',
        'accent-purple-light': '#FF4DA6',
        'accent-cyan': '#00F0FF',
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
        'glow-orange': '0 0 28px -4px rgba(255, 0, 127, 0.65)',
        'glow-teal': '0 0 28px -4px rgba(0, 240, 255, 0.60)',
        'glow-cyan': '0 0 28px -4px rgba(0, 240, 255, 0.60)',
        'cyber-pink': '0 0 24px rgba(255, 0, 127, 0.45)',
        'cyber-cyan': '0 0 24px rgba(0, 240, 255, 0.45)',
        card: '0 1px 0 rgba(0,240,255,.12), 0 18px 40px -30px rgba(0,0,0,.7)',
        'card-hover': '0 20px 45px -25px rgba(0,240,255,.35)',
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
