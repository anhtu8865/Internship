module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  extends: [
    // 'prettier',
    // "eslint:recommended",
    'plugin:react/recommended'
  ],
  rules: {
    'no-console': 'off',
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  },
  parser: "babel-eslint"
}
