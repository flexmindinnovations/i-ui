module.exports = {
  content: [
    "./projects/i-ui/src/**/*.{html,ts}",
    "./projects/i-ui/src/styles.css",
    "./projects/i-ui-demo/src/**/*.{html,ts}"
  ],
  plugins: [
    require("tailwindcss-animate")
  ],
  darkMode: "class"
}
