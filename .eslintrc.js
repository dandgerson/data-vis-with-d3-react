/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const disableA11y = () => Object.keys(require('eslint-plugin-jsx-a11y').rules).reduce(
  (acc, current) => ({
    ...acc,
    [`jsx-a11y/${current}`]: 'off',
  }),
  {},
)

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    ...disableA11y(),
    semi: [2, 'never'],
    'jsx-quotes': [2, 'prefer-single'],
    'react/forbid-prop-types': 'off',
    'arrow-parens': [2, 'as-needed'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
        paths: ['src'],
      },
    },
  },
}
