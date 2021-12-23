module.exports = {
  plugins: ['react'],
  extends: ['prettier', 'eslint:recommended', 'plugin:react/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'babel-eslint',
  rules: {
    'no-unused-vars': 'warn',
    'no-debugger': 'warn',
    'react/prop-types': 'off'
  }
};
