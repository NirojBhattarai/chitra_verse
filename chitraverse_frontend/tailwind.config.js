/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(105,116,14,1) 0%, rgba(162,166,77,1) 25%, rgba(245,3,3,1) 63%)',
      },},
  },
  plugins: [],
};
