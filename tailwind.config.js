const theme = require('./src/styles/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: theme.colors,
      fontFamily: {
        sans: theme.fonts.sans,
      },
      boxShadow: theme.shadows,
    },
  },
  plugins: [],
}