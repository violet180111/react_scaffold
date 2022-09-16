/**
 * @param: root - ESLint 一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找其他的ESLint配置文件(默认是ESLint配置文件会自动合并)
 * @param: env - 设置您的脚本在哪种环境中运行 每个环境都会带来一组特定的预定义全局变量 可以简单理解为批量设置全局变量 这些环境不是互斥的 因此您一次可以定义多个环境
 *  常用
 *  browser - 浏览器全局变量
 *  node - Node.js 全局变量和 Node.js 作用域
 *  commonjs - CommonJS 全局变量和 CommonJS 作用域 (启用此环境用于使用 Browserify/WebPack 的 browser-only 代码)
 *  shared-node-browser - Node.js 和 Browser 通用的全局变量
 *  es6 - 启用除 modules 以外的所有 ECMAScript 6 特性  (这会自动将 `ecmaVersion` 解析器选项设置为 6)
 *  es2017 - 添加所有 ECMAScript 2017 的全局变量并且自动设置 `ecmaVersion` 解析器选项设置为 8
 *  es2020 - 添加所有 ECMAScript 2020 的全局变量并且自动设置 `ecmaVersion` 解析器选项设置为 11
 *  es2021 - 添加所有 ECMAScript 2021 的全局变量并且自动设置 `ecmaVersion` 解析器选项设置为 12
 *  worker - web workers 全局变量
 * @param: estends - 继承社区整理好的配置规则
 * @param: parser - 配置解析项目的规则
 * @param: parserOptions - 配置解析项目的规则
 * @param: parserOptions.createDefaultProgram - 配置解析项目的规则
 * @param: parserOptions.ecmaFeatures - 配置你想使用的额外的语言特性
 * @param: parserOptions.ecmaFeatures.jsx - 启用jsx
 * @param: parserOptions.ecmaVersion - ECMAScript 版本
 * @param: parserOptions.sourceType - 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
 * @param: parserOptions.project - 这个选项允许你提供一个通往你的项目的tsconfig.json的路径
 * @param: parserOptions.tsconfigRootDir - 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)
 * @param: plugins - 主要是为 eslint 新增一些检查规则
 * @param: rules - ESLint配置规则
 * @param: settings - 共享设置
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-inferrable-types': ['off'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/space-before-function-paren': ['error', 'never'],
    '@typescript-eslint/strict-boolean-expressions': ['off'],
    '@typescript-eslint/triple-slash-reference': ['off'],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
    ],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/react-in-jsx-scope': ['off'],
    'react/no-unknown-property': [
      'error',
      {
        ignore: ['css'],
      },
    ],
    indent: 'off',
    quotes: 'off',
    semi: 'off',
    'lines-between-class-members': ['error', 'always'],
    'multiline-ternary': ['off'],
    'no-async-promise-executor': ['off'],
    'no-console': ['off'],
    'no-extend-native': ['off'],
    'no-extra-semi': 'error',
    'no-new': ['off'],
    'no-proto': ['off'],
    'no-return-assign': ['off'],
    'no-sequences': ['off'],
    'no-tabs': ['off'],
    'no-unreachable': ['off'],
    'no-useless-constructor': ['off'],
    'no-var': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'operator-linebreak': ['error', 'before'],
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: false,
        natural: true,
      },
    ],
    'space-before-function-paren': ['error', 'never'],
    'switch-colon-spacing': ['error'],
    'eol-last': ['error', 'always'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
