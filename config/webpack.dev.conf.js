const { readFileSync } = require('fs');
const { merge } = require('webpack-merge');
const LogsPlugin = require('./plugins/logs-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ProgressBarPlugin = require('./plugins/progress-bar-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const { getCssRule, getTsRule } = require('./js/utils');
const paths = require('./js/paths');
const progressBarPlugin = new ProgressBarPlugin({
  isDev: true,
});

/**
 * @param mode - 指明环境 开发或是生产
 * @param devtool - 生成source-map的规则: ^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$
 * @param devServer.hot - HotModuleReplacement
 * @param devServer.port - 端口号
 * @param devServer.open - 自动打开浏览器
 * @param devServer.compress - 开启gzip压缩
 * @param devServer.static - 静态资源目录
 * @param devServer.devMiddleware.writeToDisk - 开发环境下是否输出打包文件
 * @param devServer.setupMiddlewares - 提供执行自定义函数和应用自定义中间件的能力
 * @param devServer.onListening - 提供在 webpack-dev-server 开始监听端口连接时执行自定义函数的能力
 * @param module.rules - 模块构建规则
 * @param module.rules.test - 文件名匹配正则
 * @param module.rules.exclude - 要排除的文件
 * @param module.rules.use - 要使用的loader
 * @param plugins[0] - progressBarPlugin - 展示启动(构建)进度条
 * @param plugins[1] - ReactRefreshWebpackPlugin - 开启React HotModuleReplacement
 * @param plugins[2] - LogsPlugin - 自定义输出信息
 */
/** @type {import('webpack').Configuration} wepack配置代码提示 */
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    port: 7777,
    compress: true,
    static: paths.public,
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: false,
    },
    setupMiddlewares: (middlewares, devServer) => {
      const { app } = devServer;
      const { getProgress } = progressBarPlugin;

      app.get('/__progress', (_res, res) => {
        res.json({ progress: getProgress() });
      });

      app.get('/', (req, res, next) => {
        const html = readFileSync(paths.htmlStartUp, { encoding: 'utf-8' });

        if (getProgress() < 1) {
          res.set('Content-Type', 'text/html');
          res.send(html);
        } else {
          next();
        }
      });

      return middlewares;
    },
    onListening: () => {
      ['SIGINT', 'SIGTERM'].forEach(function (sig) {
        // ✨ exit gracefully
        process.on(sig, function () {
          process.exit();
        });
      });
    },
  },
  module: {
    rules: [getCssRule('style-loader'), getTsRule()],
  },
  plugins: [progressBarPlugin, new ReactRefreshWebpackPlugin(), new LogsPlugin()].filter(Boolean),
  infrastructureLogging: { level: 'none' },
  stats: 'errors-warnings',
});
