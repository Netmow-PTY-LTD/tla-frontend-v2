module.exports = {
  plugins: ["unused-imports", "import"],
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  rules: {
    "no-unused-vars": "warn",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
      },
    ],
    "import/no-unused-modules": [
      "error",
      {
        unusedExports: true,
      },
    ],
  },
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
};
