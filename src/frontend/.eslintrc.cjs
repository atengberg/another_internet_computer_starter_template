module.exports = {
    "root": true,
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "env": {
        "es6": true,
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "ecmaFeatures": {
          "jsx": true,
          "impliedStrict": true,
          "experimentalObjectRestSpread": true
        }
    },
    "ignorePatterns": [
      "node_modules/*", 
      "dist/*"
    ],
    "plugins": [
        "react",
        "react-hooks"
    ],
    "rules": {
      /*
      "no-console": [
        "error",
        {
          "allow": ["error"]
        }
      ],*/
      "no-const-assign": 2,
      "no-extra-semi": 0,
      "no-undef": "warn",
      "no-unreachable": "warn",
      "no-unsafe-finally": "warn",
      "no-unused-vars": 0,
      /*
      "no-unused-expressions": [
        "error",
        {
          "allowShortCircuit": false,
          "allowTernary": true
        }
      ],*/
      "react/no-array-index-key": "warn",
      "prefer-const": "warn",
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": 0,
      "react/no-unused-state": "warn",
      "react/react-in-jsx-scope": 0,
      //"semi": ["error", "always"]
    }
}
