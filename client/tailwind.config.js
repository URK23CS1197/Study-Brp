/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRITICAL: Tells Tailwind where to find your classes.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all files inside the src/ folder
  ],
  theme: {
    extend: {
      // Custom Colors for Consistency
      colors: {
        cyan: {
          400: '#06B6D4',
          500: '#0891B2',
        },
        purple: {
          400: '#C084FC',
          500: '#A855F7',
          900: '#6B21A8',
        },
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A8A',
        },
        gray: {
          900: '#111827',
        },
        red: {
          400: '#F87171',
          500: '#EF4444',
          800: '#991B1B',
        },
        pink: {
          500: '#EC4899',
        },
        green: {
          400: '#4ADE80',
          500: '#22C55E',
        },
      },
      // Enhanced Keyframes for Animations
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'pulse-once': {
          '0%': { opacity: '0.7', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      // Custom Animations
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        'pulse-once': 'pulse-once 0.5s ease-in-out',
      },
      // Add backdrop-blur for glassmorphism
      backdropBlur: {
        sm: '4px',
      },
      // Add mix-blend-mode for background effects
      mixBlendMode: {
        multiply: 'multiply',
      },
    },
  },
  plugins: [],
};