const { resolve } = require('path');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const { getCssRule, getJsRule } = require('./getBaseConfig');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 7777,
    open: true,
    compress: true,
    static: resolve(__dirname, '../public'),
    historyApiFallback: true,
    // 开启服务的同时打包项目
    // devMiddleware: {
    //   writeToDisk: true,
    // },
  },
  module: {
    rules: [getCssRule('style-loader'), getJsRule()],
  },
  optimization: {
    nodeEnv: 'development',
  },
});
