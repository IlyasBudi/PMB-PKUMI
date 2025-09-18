/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-primary': '#08415E',
        'green-secondary': '#4b8eaf',
        'orange-primary': '#E26D5C'
      }
    },
  },
  plugins: [],
};
