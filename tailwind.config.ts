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
        "gradient-dark": `
          radial-gradient(circle at top left, rgba(79, 70, 229, 0.15) 0%, transparent 40%),
          radial-gradient(circle at top right, rgba(124, 58, 237, 0.15) 0%, transparent 40%),
          radial-gradient(circle at bottom left, rgba(79, 70, 229, 0.1) 0%, transparent 40%),
          radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.1) 0%, transparent 40%),
          linear-gradient(to bottom, #0F172A, #1E293B)
        `,
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.5)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      }
    },
  },
  plugins: [],
} satisfies Config;


