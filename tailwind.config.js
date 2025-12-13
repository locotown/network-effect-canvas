/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backdropBlur: {
        'glass': '16px',
        'glass-lg': '24px',
        'glass-xl': '40px',
      },
      backdropSaturate: {
        'glass': '1.8',
        'glass-heavy': '2',
      },
      boxShadow: {
        'glass-sm': '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.06)',
        'glass': '0 4px 16px rgba(0, 0, 0, 0.06), 0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 8px 24px rgba(0, 0, 0, 0.08), 0 16px 48px rgba(0, 0, 0, 0.10)',
        'glass-hover': '0 8px 32px rgba(0, 0, 0, 0.10), 0 16px 64px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'glass': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-glass': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      borderRadius: {
        'glass': '16px',
        'glass-lg': '20px',
        'glass-xl': '24px',
      },
      animation: {
        'glass-pulse': 'glassPulse 3s ease-in-out infinite',
        'glass-float': 'glassFloat 6s ease-in-out infinite',
      },
      keyframes: {
        glassPulse: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        glassFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}
