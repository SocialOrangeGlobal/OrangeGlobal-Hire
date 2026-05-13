/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 'rh-red': '#eb0101ff',
        'rh-red': '#ff5900c2',
        'rh-teal': '#004b4d',
        'rh-dark': '#0d1117',
        'rh-light': '#f4f4f4',
        'rh-teal-lighter': '#00b5bbff',
      },
      fontFamily: {
        sans: ['Noto Sans Light', 'sans-serif'],
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      },
      animation: {
        blob: 'blob 7s infinite',
      }
    },
  },
  plugins: [],
};
