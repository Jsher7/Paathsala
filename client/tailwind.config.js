/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        navy: {
          900: '#0d1117',
          800: '#161b22',
          700: '#1c2230',
          600: '#212d3d',
          500: '#2d3e55',
        },
        accent: {
          cyan: '#06b6d4',
          gold: '#f59e0b',
          violet: '#8b5cf6',
          emerald: '#10b981',
        }
      },
      borderRadius: {
        'nm': '18px',
        'nm-sm': '12px',
        'nm-lg': '24px',
      },
      boxShadow: {
        'nm-out': '-4px -4px 10px rgba(255,255,255,0.03), 4px 4px 14px rgba(0,0,0,0.6)',
        'nm-in': 'inset -3px -3px 6px rgba(255,255,255,0.025), inset 3px 3px 10px rgba(0,0,0,0.5)',
        'nm-hover': '-6px -6px 14px rgba(6,182,212,0.06), 6px 6px 18px rgba(0,0,0,0.7)',
        'glass': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        'cyan-glow': '0 0 20px rgba(6,182,212,0.25), 0 0 60px rgba(6,182,212,0.1)',
        'gold-glow': '0 0 20px rgba(245,158,11,0.2), 0 0 60px rgba(245,158,11,0.08)',
      },
      backdropBlur: {
        'glass': '16px',
      },
      animation: {
        'fade-up': 'fadeSlideUp 0.5s ease forwards',
        'slide-in': 'slideInLeft 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease infinite',
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(6,182,212,0.25)' },
          '50%': { boxShadow: '0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.2)' },
        },
      },
    },
  },
  plugins: [],
}
