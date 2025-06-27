/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D5016',
        secondary: '#7C9070',
        accent: '#E07A5F',
        success: '#4A7C59',
        warning: '#F2CC8F',
        error: '#C1666B',
        info: '#4A90A4',
        surface: {
          50: '#FAFAF8',
          100: '#F4F1E8',
          200: '#E8E2D5',
          300: '#D7CDB8',
          400: '#C2B397',
          500: '#A89877',
          600: '#8F7F5C',
          700: '#756647',
          800: '#5C4F36',
          900: '#433A28'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['DM Sans', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
}