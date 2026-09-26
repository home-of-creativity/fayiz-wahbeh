/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        terracotta: {
          50: '#FBF1EC',
          100: '#F4DCD1',
          200: '#E9B6A2',
          300: '#DB8B6F',
          400: '#CD6545',
          DEFAULT: '#C04A2C',
          500: '#C04A2C',
          600: '#A63D23',
          700: '#86311C',
          800: '#652516',
        },
        brown: {
          DEFAULT: '#462715',
          600: '#3A2011',
          700: '#2E190D',
          800: '#23130A',
        },
        charcoal: {
          DEFAULT: '#3F3F3F',
          soft: '#6B6560',
        },
        cream: '#F7F3ED',
        sand: '#EDE4D6',
        clay: '#E6D3C3',
        stone: '#D9D0C3',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      maxWidth: {
        site: '1440px',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
