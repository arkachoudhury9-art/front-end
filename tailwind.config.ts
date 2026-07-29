import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#fafafa",
          raised: "#ffffff",
          border: "#e0e0e0",
        },
        accent: {
          DEFAULT: "#1877f2",
          muted: "#e7f3ff",
        },
        priority: {
          critical: "#f44336",
          high: "#ff9800",
          medium: "#ffc107",
          low: "#4caf50",
        },
        ws: {
          row: "#e7f3ff",
          "row-hover": "#d8ebff",
          border: "#1877f2",
        },
      },
      fontFamily: {
        sans: ["Roboto", "Helvetica Neue", "sans-serif"],
        mono: ["Roboto Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
