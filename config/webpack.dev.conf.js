const { resolve } = require('path');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const { getCssRule, getJsRule } = require('./getBaseConfig');

/** @type {import('webpack').Configuration} wepack配置代码提示 */
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', // ^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$
  devServer: {
    hot: true,
    port: 7777,
    open: true,
    compress: true,
    static: resolve(__dirname, '../public'),
    historyApiFallback: true,
    // 开启服务的同时打包项目
    devMiddleware: {
      writeToDisk: false,
    },
  },
  module: {
    rules: [getCssRule('style-loader'), getJsRule()],
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  optimization: {
    nodeEnv: 'development',
  },
});
