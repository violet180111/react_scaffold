const { readFileSync } = require('fs');
const { ProgressPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const { resolveDir, getCssRule, getTsRule } = require('./utils');
let isShowStartUp = true;
let html = '';

try {
  html = readFileSync(resolveDir('config/start-up.html'), { encoding: 'utf-8' });
} catch (e) {
  isShowStartUp = false;
}

let progress = 0;
/**
 * @param percentage 当前构建进度，取值范围[0,1]
 * @params message 构建模块信息
 */
const handler = (percentage) => (progress = percentage);

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
    open: true,
    port: 7777,
    compress: true,
    static: resolveDir('public'),
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: false,
    },
    setupMiddlewares: isShowStartUp
      ? (middlewares, devServer) => {
          const { app } = devServer;

          app.get('/__progress', (_res, res) => {
            res.json({ progress });
          });

          app.get('/', (req, res, next) => {
            if (progress < 1) {
              res.set('Content-Type', 'text/html');
              res.send(html);
            } else {
              next();
            }
          });

          return middlewares;
        }
      : void 0,
  },
  module: {
    rules: [getCssRule('style-loader'), getTsRule()],
  },
  plugins: [isShowStartUp && new ProgressPlugin(handler), new ReactRefreshWebpackPlugin()].filter(Boolean),
});
