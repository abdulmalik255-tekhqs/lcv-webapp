/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0f0f0f',
          950: '#050505',
        },
        slate: {
          950: '#0b1426',
        },
      },
      boxShadow: {
        card: '0 18px 40px -15px rgba(17, 38, 111, 0.25)',
      },
    },
  },
  plugins: [],
}

