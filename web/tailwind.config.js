/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['\'Nunito\'', 'sans-serif'],
      },
      colors: {
        primary: '#5b8ef7',
        accent: '#a8b9ff',
      },
    },
  },
  plugins: [],
}
