import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        industrial: "rgb(var(--industrial-black-rgb) / <alpha-value>)",
        paper: "rgb(var(--paper-white-rgb) / <alpha-value>)",
        redline: "rgb(var(--constructivist-red-rgb) / <alpha-value>)",
        warning: "rgb(var(--warning-yellow-rgb) / <alpha-value>)"
      },
      fontFamily: {
        swiss: ["var(--font-swiss)"],
        mono: ["var(--font-space-mono)"]
      }
    }
  },
  plugins: []
};

export default config;
