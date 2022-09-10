const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolveDir = (path) => resolve(__dirname, path);

module.exports = {
  entry: resolveDir('../src/index.tsx'),
  output: {
    path: resolveDir('../dist'),
    filename: 'assets/js/[name].[contenthash:8].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: 'static/images/[name][contenthash:8][ext]',
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
          filename: 'static/fonts/[name][contenthash:8][ext]',
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
