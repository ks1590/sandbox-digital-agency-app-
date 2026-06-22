/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@digital-go-jp/tailwind-theme-plugin'),
    require('@tailwindcss/container-queries'),
  ],
};
