const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      // "@/..." resolves to ./src (tsconfig.json). Metro validates these at bundle time.
      "import/no-unresolved": ["error", { ignore: ["^@/"] }],
    },
  },
  { ignores: ["dist/*", ".expo/*"] },
]);
