import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EADA88",
          light: "#F7EDE6", // Beige claro
          dark: "#8C9E8C", // Verde oscuro suave
        },
        accent: {
          DEFAULT: "#E8C5B5", // Rosa pálido
          light: "#D2D8C0", // Verde grisáceo pálido
        },
        neutral: {
          DEFAULT: "#778586", // Gris cálido oscuro
          light: "#AEB898", // Verde grisáceo claro
        },
      },
    },
  },
  plugins: [],
};
export default config;
