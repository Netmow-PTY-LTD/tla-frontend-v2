// eslint.config.js
export default {
    root: true,
    parser: "@typescript-eslint/parser",  // must be a string
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "next/core-web-vitals"
    ],
    rules: {
        // your rules
    },
    ignores: ["node_modules/**", "dist/**", "public/**"], // replaces .eslintignore
};