/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#160527",
        secondary: "#54E097",
        accent: "#FE5796",
        cyan: "#14F5D6",
        "background-light": "#F3F5F7",
        "background-dark": "#0F0F12",
        "card-light": "#FFFFFF",
        "card-dark": "#1E1E24",
        "text-light": "#160527",
        "text-dark": "#F3F5F7",
        "border-light": "#E6E6E6",
        "border-dark": "#2E2E33",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 0 20px rgba(84, 224, 151, 0.4)",
      },
    },
  },
  plugins: [],
}
