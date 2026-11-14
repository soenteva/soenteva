/** @type {import('tailwindcss').Config} */
module.exports = {
  // `overline` is a Tailwind utility; without this an app's own eyebrow-label class draws a line above the text.
  blocklist: ["overline"],
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope Variable"', "Arial", "sans-serif"],
      },
      colors: {
        // Colours taken from irti-robotics.com: header/footer #113959, buttons #FAAF3A.
        navy: {
          DEFAULT: "#113959",
          50: "#f1f5f9",
          100: "#e1e9f0",
          200: "#c3d3e0",
          700: "#0d2d48",
          800: "#0a2338",
          900: "#071827",
        },
        amber: {
          DEFAULT: "#FAAF3A",
          600: "#e8991a",
          100: "#fef1d8",
        },
      },
      keyframes: {
        sway: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(7deg)" },
        },
        swayFast: {
          "0%, 100%": { transform: "rotate(10deg)" },
          "50%": { transform: "rotate(-12deg)" },
        },
        rise: {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        sway: "sway 7s ease-in-out infinite",
        swayFast: "swayFast 5s ease-in-out infinite",
        rise: "rise .7s ease-out both",
      },
    },
  },
  plugins: [],
};
