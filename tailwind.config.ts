import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4F46E5",
        secondary: "#7C3AED",
        "dark-blue": "#0F172A",
        "light-blue": "#1E293B",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(to right, #4F46E5, #7C3AED)",
        "gradient-dark": "linear-gradient(to bottom, #0F172A, #1E293B)",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config;
