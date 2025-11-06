/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E1F196',
          DEFAULT: '#5ABA8A',
          dark: '#064B64',
        },
        accent: {
          light: '#328D91',
          DEFAULT: '#196E7F',
        },
        background: {
          light: '#F4F8FA',
          DEFAULT: '#FFFFFF',
        }
      },
    },
  },
  plugins: [],
};
