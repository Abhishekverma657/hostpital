/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // All colors point to CSS vars → backend can change them at runtime
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          dark: 'var(--color-secondary-dark)',
        },
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        surfaceAlt: 'var(--color-surface-alt)',
        htext: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        subtle: 'var(--color-text-light)',
        hborder: 'var(--color-border)',
        hbg: 'var(--color-background)',
        danger: 'var(--color-danger)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        xl2: '20px',
        xl3: '28px',
      },
      boxShadow: {
        glow: '0 4px 24px rgba(14,165,233,0.18)',
        'glow-lg': '0 8px 40px rgba(14,165,233,0.28)',
        card: '0 2px 16px rgba(0,0,0,0.07)',
        float: '0 8px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        pulse_glow: 'pulseGlow 1.5s ease infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(28px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(14,165,233,0.45)' },
          '50%': { boxShadow: '0 0 0 14px rgba(14,165,233,0)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--color-gradient)',
        'gradient-hero': 'var(--color-gradient-hero)',
      },
    },
  },
  plugins: [],
};
