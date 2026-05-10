/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#fffaf0",
        bone: "#f5efe4",
        ink: "#22211f",
        muted: "#706a61",
        clay: "#9a5b32",
        olive: "#657359",
        charcoal: "#2e302c",
        line: "#ded4c4",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 22px 60px rgba(44, 38, 30, 0.10)",
      },
    },
  },
  plugins: [],
};
