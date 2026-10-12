const base = require("./colors");

const light = {
    ...base,
    background: "#FFFFFF",
    card: "#FFFFFF",
    contrast: "#FFFFFF",
};

const dark = {
    background: "#0F1012",
    card: "#1C1D21",
    contrast: "#081426",

    brand: {
        50: "#1E1B36",
        100: "#292447",
        200: "#39335B",
        500: "#6366F1",
        600: "#818CF8",
        700: "#A5B4FC",
    },

    ink: {
        DEFAULT: "#F5F5F5",
        soft: "#D4D4D8",
        muted: "#A1A1AA",
    },

    line: "#35363D",
    surface: "#25262B",

    warn: {
        100: "#382B14",
        600: "#FBBF24",
        700: "#FCD34D",
    },

    danger: {
        100: "#3B1E29",
        500: "#F87171",
        600: "#FCA5A5",
    },

    success: {
        100: "#143526",
        700: "#86EFAC",
    },
};

// Example: ink.DEFAULT → ink; brand[600] → brand-600.
function flattenColors(object, prefix = "") {
    return Object.entries(object).reduce((result, [key, value]) => {
        const name =
            key === "DEFAULT" ? prefix : [prefix, key].filter(Boolean).join("-");

        if (typeof value === "object") {
            Object.assign(result, flattenColors(value, name));
        } else {
            result[name] = value;
        }

        return result;
    }, {});
}

module.exports = { light, dark, flattenColors };