module.exports = {
  "plugins": ["react"],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "parser": "babel-eslint",
  "rules": {
    "no-debugger": "warn",
    "react/prop-types": "off"
  }
};