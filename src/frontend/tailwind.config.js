export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  //darkMode: 'class', add when dark mode is either defined in theme or all over.
  theme: {

  },
  plugins: [
     require('tailwindcss-debug-screens'),
  ]
}