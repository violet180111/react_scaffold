/**
 * @param: printWidth - 单行多少字符换行
 * @param: tabWidth - 个 Tab 缩进空格数量
 * @param: semi - 每一行结尾需要有分号
 * @param: singleQuote - 使用单引号
 * @param: quoteProps - 在对象属性中，仅在必要时才使用引号，如 "prop-foo"
 * @param: jsxSingleQuote - 在 jsx 中使用双引号
 * @param: trailingComma - 在多行逗号分隔的语法结构中尽可能打印尾部逗号
 * @param: bracketSpacing - 大括号内首尾需要空格
 * @param: bracketSameLine - HTML 标签（以及 JSX，Vue 模板等）的反尖括号 > 需要换行
 */

module.exports = {
  printWidth: 120,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
};
