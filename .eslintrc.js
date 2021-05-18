module.exports = {
  "plugins": ["react"],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "babel-eslint",
  "rules": {
    "no-debugger": "warn",
    "react/prop-types": "off"
}
};