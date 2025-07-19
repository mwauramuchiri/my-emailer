module.exports = {
  extends: [
    "plugin:vue/essential",
    "plugin:vue/strongly-recommended",
    "plugin:vue/recommended"
  ],
  rules: {
    "no-useless-escape": "off",
    "vue/v-on-style": ["error", "longform"],
    "vue/v-bind-style": ["error", "longform"],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "htmlWhitespaceSensitivity": "ignore"
  },
  "parserOptions": {
    "parser": "babel-eslint"
  }
};

// "prettier": "./.prettierrc.js",