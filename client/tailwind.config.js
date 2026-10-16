/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // <html class="dark">, toggled by the navbar theme button
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Colours come from CSS variables in index.css (:root = light, .dark = dark theme).
      colors: {
        accent: {
          DEFAULT: '#FF3131',
          20: 'rgba(255, 49, 49, 0.2)',
          30: 'rgba(255, 49, 49, 0.3)',
        },
        paper: 'rgb(var(--paper) / <alpha-value>)', // page + card background
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)', // body text
          heading: 'rgb(var(--ink-heading) / <alpha-value>)',
        },
        secondary: 'var(--secondary)', // paragraphs
        muted: 'var(--muted)', // small labels, eyebrow kicker
        grey: 'rgb(var(--grey) / <alpha-value>)', // meta text
        border: 'rgb(var(--border) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)', // pills
          soft: 'rgb(var(--surface-soft) / <alpha-value>)', // card hover
        },
        dark: {
          DEFAULT: 'rgb(var(--dark) / <alpha-value>)', // black buttons, marquee, tags
          black: '#000000',
        },
      },
      borderRadius: {
        card: '0.375rem',
      },
      letterSpacing: {
        eyebrow: '2.4px',
        kicker: '2.5px',
        marquee: '1.8px',
        stat: '1px',
        tightest: '-0.03em',
      },
      lineHeight: {
        name: '1.05',
        body: '1.8',
      },
      fontSize: {
        eyebrow: ['12px', { lineHeight: '1', fontWeight: '700' }],
        kicker: ['14px', { lineHeight: '1', fontWeight: '700' }],
        'stat-label': ['10px', { lineHeight: '1.2', fontWeight: '700' }],
        watermark: ['clamp(96px, 17vw, 240px)', { lineHeight: '1', fontWeight: '800' }],
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        'marquee-reverse': 'marquee-reverse 80s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
