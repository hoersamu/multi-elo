/* eslint-disable @typescript-eslint/no-magic-numbers */
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: ["/lib/**/*", "**/*.html"],
  plugins: ["@typescript-eslint", "simple-import-sort"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Your TypeScript files extension

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],

      parserOptions: {
        project: ["./tsconfig.json"], // Specify it only for TypeScript files
      },
    },
  ],
  rules: {
    "no-restricted-syntax": [
      "warn",
      {
        selector: "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|info)$/]",
        message: "Do not use console.* for production. Allowed methods are console.info/warn/error.",
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        ignoredMethodNames: ["constructor"],
        overrides: {
          methods: "explicit",
          properties: "explicit",
          constructors: "explicit",
        },
      },
    ],
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/member-delimiter-style": [
      "warn",
      {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/comma-spacing": ["warn"],
    "@typescript-eslint/typedef": [
      "error",
      {
        arrowParameter: false,
        variableDeclaration: false,
      },
    ],
    "@typescript-eslint/array-type": ["warn", { default: "array" }],
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-misused-new": "warn",
    "@typescript-eslint/no-magic-numbers": [
      "warn",
      {
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true,
        detectObjects: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true,
        ignoreEnums: true,
      },
    ],
    "@typescript-eslint/member-ordering": [
      "warn",
      {
        default: [
          "private-static-field",
          "private-instance-field",
          "protected-static-field",
          "protected-instance-field",
          "public-static-field",
          "public-instance-field",
          "private-constructor",
          "protected-constructor",
          "public-constructor",
          "method",
        ],
      },
    ],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-useless-constructor": "off",
    "sort-imports": "off",
    "no-param-reassign": ["error", { props: false }],
    "brace-style": ["warn", "1tbs"],
    "@typescript-eslint/quotes": ["warn", "double"],
    "@typescript-eslint/semi": ["warn", "always"],
    "arrow-body-style": "warn",
    "comma-dangle": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    complexity: [
      "warn",
      {
        max: 20,
      },
    ],
    "constructor-super": "warn",
    curly: "warn",
    eqeqeq: ["off", "always"],
    "id-blacklist": [
      "warn",
      "any",
      "Number",
      "number",
      "String",
      "string",
      "Boolean",
      "boolean",
      "Undefined",
      "undefined",
    ],
    "id-match": "warn",
    "max-classes-per-file": ["warn", 1],
    "no-cond-assign": "warn",
    "no-duplicate-case": "warn",
    "no-duplicate-imports": "warn",
    "no-empty": "warn",
    "no-invalid-this": "off",
    "no-irregular-whitespace": "warn",
    "no-multiple-empty-lines": "off",
    "no-new-wrappers": "warn",
    "no-redeclare": "warn",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["warn"],
    "no-template-curly-in-string": "warn",
    "no-throw-literal": "warn",
    "no-trailing-spaces": "warn",
    "no-underscore-dangle": "off",
    "no-unused-expressions": "error",
    "no-var": "warn",
    "one-var": ["warn", "never"],
    "prefer-const": "warn",
    "prefer-template": "warn",
    "quote-props": ["warn", "consistent"],
    radix: "warn",
    "space-before-function-paren": 0,
    "space-in-parens": 0,
    "spaced-comment": "warn",
    "use-isnan": "warn",
  },
};
