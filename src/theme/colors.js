// Single source of truth for the palette.
// tailwind.config.js uses it for class names (bg-brand-600, text-ink-soft, ...),
// and components import it when a raw hex is needed (icons, tab bar, placeholders).
// Text/background pairs are tuned to WCAG AA (4.5:1): muted text, badge text on tinted fills.
module.exports = {
  brand: {
    50: "#F2F7FF",
    100: "#E3EEFE",
    200: "#C9DEFC",
    500: "#2F7DF4",
    600: "#0F6BF0",
    700: "#0B56C3",
  },
  ink: { DEFAULT: "#0F1B2D", soft: "#4B5C72", muted: "#5F6F84" },
  line: "#E5EBF2",
  surface: "#F3F6FA",
  warn: { 100: "#FDE9C8", 600: "#B45309", 700: "#A34A08" },
  danger: { 100: "#FDE7E7", 500: "#E5484D", 600: "#C02B31" },
  success: { 100: "#DCF4E5", 700: "#13703A" },
};
