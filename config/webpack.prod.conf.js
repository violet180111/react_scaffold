const { merge } = require('webpack-merge');
const threadLoader = require('thread-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { resolve } = require('path');
const resolveDir = (path) => resolve(__dirname, path);
const baseWebpackConfig = require('./webpack.base.conf');
const { getCssRule, getJsRule } = require('./getBaseConfig');
const isGenAnalyz = JSON.parse(process.env.IS_GEN_ANALYZ);
const configFilenames = [
  'webpack.base.conf.js',
  'webpack.dev.conf.js',
  'webpack.prod.conf.js',
  '../babel.config.js',
  '../tsconfig.json',
];

// 多进程打包构建
threadLoader.warmup(
  {
    workers: 2,
    workerParallelJobs: 50,
  },
  [
    // 子进程中需要预加载的 node 模块
    'babel-loader',
  ],
);

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [getCssRule(MiniCssExtractPlugin.loader), getJsRule('thread-loader')],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[hash:8].css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: isGenAnalyz, // 是否生成stats.json文件
    }),
  ],
  optimization: {
    nodeEnv: 'production',
    runtimeChunk: 'single', // 将运行时代码单独打包成一个文件
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'chunk-common',
          chunks: 'all',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
          enforce: true,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 2,
          enforce: true,
          reuseExistingChunk: true,
        },
      },
    },
  },
  cache: {
    type: 'filesystem', // 缓存到文件系统中
    buildDependencies: {
      // 下面这些配置文件发生改变时重新构建并生成缓存
      config: configFilenames.map((name) => resolveDir(name)),
    },
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 2 * 1024 * 1024,
    maxEntrypointSize: 2 * 1024 * 1024,
  },
});
