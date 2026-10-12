const colors = require("./src/theme/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: { colors },
  },
  plugins: [],
};
