const { light, flattenColors } = require("./src/theme/themes");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class",

    theme: {
        extend: {
            colors: Object.fromEntries(
                Object.keys(flattenColors(light)).map((name) => [
                    name,
                    `rgb(var(--${name}) / <alpha-value>)`,
                ]),
            ),
        },
    },

    plugins: [],
};