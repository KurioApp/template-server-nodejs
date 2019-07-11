module.exports = {
  env: {
    es6: true,
    node: true,
    "jest/globals": true,
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
  ],
  plugins: [
    "jest",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
  },
};
