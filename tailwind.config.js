/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cute: ['Pacifico', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        pastel: {
          pink: '#FFB3C6',
          purple: '#D4A5F5',
          blue: '#A5C8F5',
          peach: '#FFCBA4',
          green: '#B5EAD7',
        },
      },
    },
  },
  plugins: [],
}
