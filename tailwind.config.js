/** @type {import('tailwindcss').Config} */
module.exports = {
  // `overline` is a Tailwind utility; without this an app's own eyebrow-label class draws a line above the text.
  blocklist: ["overline"],
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope Variable"', "Arial", "sans-serif"],
        // Display font of the home page (Unbounded 700, bundled through @fontsource, no external request).
        display: ["Unbounded", '"Manrope Variable"', "Arial", "sans-serif"],
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
        // Home page palette, sampled from the Arobotic reference screenshot.
        deep: {
          950: "#001920", // darkest sections, footer
          900: "#031a22", // hero, right edge
          800: "#022d33", // main teal sections
          700: "#063d44", // hero, left edge
          600: "#06454e", // split panel
          card: "#0b3036",
        },
        lime: {
          DEFAULT: "#e1ff7c",
          ink: "#011b00", // text on lime
        },
        mist: "#c4d5dc", // body text on dark
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
