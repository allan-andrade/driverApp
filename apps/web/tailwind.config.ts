import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#111827',
        cloud: '#f8fafc',
        accent: '#0f766e',
        warm: '#f97316',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 55%, #ffedd5 100%)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        rise: 'rise 500ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
