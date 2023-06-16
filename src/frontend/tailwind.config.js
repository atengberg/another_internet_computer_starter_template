export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {},
  plugins: [
     require('tailwindcss-debug-screens'),
  ]
}