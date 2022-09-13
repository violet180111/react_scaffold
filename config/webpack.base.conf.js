const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolveDir = (path) => resolve(__dirname, path);
const hash = process.env.NODE_ENV === 'production' ? '[contenthash:8]' : ''; // 计算hash值也会损耗一定性能
/**
 * 更多内容 @see: https://webpack.docschina.org/
 */
/** @type {import('webpack').Configuration} wepack配置代码提示 */
module.exports = {
  entry: resolveDir('../src/index.tsx'),
  output: {
    path: resolveDir('../dist'), // 生成文件父路径
    filename: `assets/js/[name]${hash}.js`, // 生成文件子路径 + 文件名
    clean: true, // 自动清空输出目录 webpack5不用再配置 clean-webpack-plugin
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: `static/images/[name]${hash}}[ext]`,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, //超过50kb不转 base64
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: `static/fonts/[name]${hash}}[ext]`,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 超过100kb不转 base64
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, // js、css文件插入位置
      template: resolveDir('../public/index.html'), // 以哪个html文件为模板创建
      filename: 'index.html', // 输出的html文件名字
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', 'json'], // 文件匹配优先级 例如import xxx from './test' 首先是找 test.ts 再是 test.tsx
    alias: {
      '@': resolveDir('src'), // 路径别名 @/ === src/
    },
  },
  performance: {
    hints: false,
  },
};
