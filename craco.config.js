const path = require("path");

module.exports = {
  jest: {
    configure: (jestConfig) => ({
      ...jestConfig,
      resetMocks: false,
      moduleNameMapper: {
        ...jestConfig.moduleNameMapper,
        "^@/(.*)$": "<rootDir>/src/$1",
        // Jest 27 (Create React App) ignores package "exports". react-router v7 only publishes its files there.
        "^react-router/dom$": "<rootDir>/node_modules/react-router/dist/development/dom-export.js",
        "^react-router$": "<rootDir>/node_modules/react-router/dist/development/index.js",
      },
    }),
  },
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
};
