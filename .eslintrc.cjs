module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "prettier"],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/no-v-model-argument": "off",
    "prettier/prettier": "error",
  },
  settings: {
    "import/resolver": {
      typescript: {},
      alias: {
        map: [["@", "./src"]],
        extensions: [".ts", ".js", ".jsx", ".json", ".vue"],
      },
    },
  },
};
