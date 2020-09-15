module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  ignorePatterns: [".eslintrc.js", "out/**", "postcss.config.js"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-unused-vars": "warn",
    "react/prop-types":
      "off" /* This probably isn't worth the hassle; move to TypeScript instead, maybe */,
    "react-hooks/exhaustive-deps": "warn",
  },
};
