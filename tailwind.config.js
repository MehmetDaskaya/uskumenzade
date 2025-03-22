// bg-gradient-to-br from-yellow-50 to-gray-100

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        popupSlideIn: "popupSlideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        popupSlideIn: {
          "0%": { opacity: 0, transform: "translateY(-20px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      },

      colors: {
        primary: "#d09c24", // Primary color (Golden Yellow)
        secondary: "#98a45c", // Secondary background (Muted Green)
        tertiary: "#b5cb3d", // Tertiary color (Lighter Golden Yellow)
        quaternary: "#688c5d", // Quaternary color (Golden Yellow)
        background: "#FFF8D9", // Main background (Soft Yellow)
        button: "#28542c", // Button color (Deep Green)
        accent: "#f0cc6c", // Accent color (Lighter Golden Yellow)
        dark: "#1F2937", // Dark Gray
        light: "#DDE0E6", // Light Gray
        adminPanelDark: "#1f2937",
        footerDark: "#101827",

        text: {
          light: "#6B7280", // Light Gray for text
          dark: "#1F2937", // Dark Gray for text
        },

        // Additional utility colors
        border: "#D1D5DB", // Light gray for borders
        shadow: "#9CA3AF", // Slightly darker gray for shadows
      },

      fontFamily: {
        sans: ["Maven Pro", "sans-serif"],
      },
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "falling-leaf": "fallingLeaf 2s ease-in-out forwards",
      },
      keyframes: {
        fallingLeaf: {
          "0%": {
            transform:
              "translateY(0) translateX(0) rotate(var(--rotate-start))",
            opacity: 1,
          },
          "25%": {
            transform: "translateY(-20px) translateX(15px) rotate(30deg)",
          },
          "50%": {
            transform: "translateY(20px) translateX(-15px) rotate(-30deg)",
          },
          "75%": {
            transform: "translateY(40px) translateX(10px) rotate(20deg)",
          },
          "100%": {
            transform: "translateY(70px) translateX(0) rotate(0deg)",
            opacity: 0,
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
    },
    variants: {
      scrollbar: ["rounded"],
      extend: {
        position: ["sticky"],
      },
    },
  },
};
