/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", maxHeight: "0" },
          "100%": { opacity: "1", maxHeight: "500px" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 197, 24, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(245, 197, 24, 0)" },
        },
      },
    },
  },
  plugins: [],
};
