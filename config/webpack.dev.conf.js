const { resolve } = require('path');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const { getCssRule, getJsRule } = require('./getBaseConfig');

/**
 * @param: mode - 指明环境 开发或是生产
 * @param: devtool - 生成source-map的规则: ^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$
 * @param: devServer.hot - HotModuleReplacement
 * @param: devServer.port - 端口号
 * @param: devServer.open - 自动打开浏览器
 * @param: devServer.compress - 开启gzip压缩
 * @param: devServer.static - 静态资源目录
 * @param: devServer.devMiddleware.writeToDisk - 开发环境下是否输出打包文件
 * @param: module.rules - 模块构建规则
 * @param: module.rules.test - 文件名匹配正则
 * @param: module.rules.exclude - 要排除的文件
 * @param: module.rules.use - 要使用的loader
 * @param: plugins[0] - ReactRefreshWebpackPlugin - 开启React HotModuleReplacement
 */
/** @type {import('webpack').Configuration} wepack配置代码提示 */
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    port: 7777,
    open: true,
    compress: true,
    static: resolve(__dirname, '../public'),
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: false,
    },
  },
  module: {
    rules: [getCssRule('style-loader'), getJsRule()],
  },
  plugins: [new ReactRefreshWebpackPlugin()],
});
