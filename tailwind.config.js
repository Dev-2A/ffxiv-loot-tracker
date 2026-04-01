/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // FFXIV 느낌의 커스텀 팔레트
        ff: {
          dark: "#1a1a2e",
          deeper: "#16213e",
          accent: "#e94560",
          gold: "#f5c518",
          blue: "#0f3460",
          surface: "#232741",
          text: "#e8e8e8",
          muted: "#8888a0",
        },
      },
    },
  },
  plugins: [],
};
