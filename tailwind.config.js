/** @type {import('tailwindcss').Config} */
module.exports = {
  // `overline` is a Tailwind utility; without this an app's own eyebrow-label class draws a line above the text.
  blocklist: ["overline"],
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope Variable"', "Arial", "sans-serif"],
        // Display font of the site (Unbounded 700, bundled through @fontsource, no external request).
        display: ["Unbounded", '"Manrope Variable"', "Arial", "sans-serif"],
      },
      colors: {
        // Palette sampled from the Arobotic reference screenshot.
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
    },
  },
  plugins: [],
};
