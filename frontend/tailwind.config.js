/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fcf9f6',
          100: '#f7f1eb',
          200: '#efe0d2',
          300: '#e1c6af',
          400: '#cca383',
          500: '#b7835c', // Light creamy brown
          600: '#9c6643',
          700: '#825036',
          800: '#6b432e',
          900: '#4a3022', // Deep chocolate brown for text
        },
        accent: {
          50: '#fcf9f6',
          100: '#f7f1eb',
          200: '#efe0d2',
          300: '#e1c6af',
          400: '#cca383',
          500: '#b7835c', // Beautiful creamy brown
          600: '#9c6643',
          700: '#825036',
          800: '#6b432e',
          900: '#563828',
        },
        surface: {
          50: '#faf8f6',
          100: '#f4f1eb',
          200: '#e8e2d7',
          300: '#d7cec0',
          400: '#b8a994',
          500: '#9b8871',
          600: '#7a6b58',
          700: '#5c5042',
          800: '#363028',
          900: '#1e1b16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
