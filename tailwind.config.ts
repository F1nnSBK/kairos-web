// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A0A",
        surface: "#141414",
        "surface-low": "#1B1B1B",
        "rose-muted": "#C08497",
        "on-surface": "#E2E2E2",
        outline: "#404040",
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Space Grotesk", "monospace"],
      },
      boxShadow: {
        "hard-white": "4px 4px 0px 0px #FFFFFF",
        "hard-rose": "8px 8px 0px 0px #C08497",
        "hard-obsidian": "4px 4px 0px 0px #0A0A0A",
      },
      borderWidth: {
        "4": "4px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
} as Config;
