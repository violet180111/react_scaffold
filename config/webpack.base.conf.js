const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolveDir = (path) => resolve(__dirname, path);
const hash = process.env.NODE_ENV === 'production' ? '.[contenthash:8]' : ''; // 计算hash值也会损耗一定性能
/**
 * 更多内容 @see: https://webpack.docschina.org/
 * @param: entry - 入口文件路径
 * @param: output.path - 生成文件父路径
 * @param: output.filename - 生成文件子路径 + 文件名
 * @param: output.clean - 自动清空输出目录 webpack5不用再配置 clean-webpack-plugin
 * @param: module.rules - 模块构建规则
 * @param: module.rules.test - 文件名匹配正则
 * @param: module.rules.type - 设置类型用于匹配模块 https://webpack.docschina.org/configuration/module/#ruletype
 * @param: module.rules.generator.filename - 输出文件位置以及文件名
 * @param: module.rules.parser.dataUrlCondition.maxSize - 超过多大不转 base64
 * @param: plugins[0] - HtmlWebpackPlugin - 生产html文件并注入对应css、js文件
 * @see: https://github.com/jantimon/html-webpack-plugin
 * {
 *   inject: 文件插入位置
 *   template: 以哪个html文件为模板创建
 *   filename: 输出的html文件名字
 * }
 * @param: resolve.extensions - 文件匹配优先级 例如import xxx from './test' 首先是找 test.ts 再是 test.tsx
 * @param: resolve.alias - 路径别名 @/ === src/
 * @param: performance.hint - 性能提示形式
 */
/** @type {import('webpack').Configuration} wepack配置代码提示 */
module.exports = {
  entry: resolveDir('../src/index.tsx'),
  output: {
    path: resolveDir('../dist'),
    filename: `assets/js/[name]${hash}.js`,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/,
        type: 'asset',
        generator: {
          filename: `static/images/[name]${hash}}[ext]`,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: `static/fonts/[name]${hash}}[ext]`,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: resolveDir('../public/index.html'),
      filename: 'index.html',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', 'json'],
    alias: {
      '@': resolveDir('src'),
    },
  },
  performance: {
    hints: false,
  },
};
