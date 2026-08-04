import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#f2f1ff',
          100: '#e8e5ff',
          200: '#d4cfff',
          300: '#b3a9ff',
          400: '#8d7bff',
          500: '#6d54f9',
          600: '#5b39ed',
          700: '#4c2bd1',
          800: '#3f26a8',
          900: '#352284',
          950: '#211458'
        }
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        elevated: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
      }
    }
  },
  plugins: [typography]
}