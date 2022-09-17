const { merge } = require('webpack-merge');
const threadLoader = require('thread-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');
const { resolveDir, getCssRule, getTsRule } = require('./utils');
const { IS_GEN_BUNDLE, IS_MEA_SPEED } = process.env;
const isGenAnalyz = JSON.parse(IS_GEN_BUNDLE ?? false);
const isMeaSpeed = JSON.parse(IS_MEA_SPEED ?? false);
const configFilenames = [
  'config/webpack.base.conf.js',
  'config/webpack.dev.conf.js',
  'config/webpack.prod.conf.js',
  'babel.config.js',
  'tsconfig.json',
];

/**
 * @see: https://github.com/webpack-contrib/thread-loader
 * @description: 多进程打包构建
 * @param: workers - 线程实例数量
 * @param: workerParallelJobs - 每个线程可并发执行的最大任务数
 */
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

/**
 * @description: 获取webpack配置
 * @param: mode - 指明是开发环境还是生产环境
 * @param: module.rules - 模块构建规则
 * @param: module.rules.test - 文件名匹配正则
 * @param: module.rules.exclude - 要排除的文件
 * @param: module.rules.use - 要使用的loader
 * @param: plugins[1] - CompressionPlugin - 用于gizp压缩
 * @see: https://github.com/webpack-contrib/compression-webpack-plugin
 * {
 *   test: 文件名匹配正则
 *   filename: 生成文件路径 + 文件名
 *   algorithm: 压缩格式,默认是gzip
 *   threshold: 只有大小大于该值的资源会被处理。默认值是 10k
 *   minRatio: 压缩率,默认值是 0.8
 * }
 * @param: plugins[2] - CopyPlugin - 文件复制
 * @see: https://github.com/webpack-contrib/copy-webpack-plugin
 * {
 *   from: 要copy的文件
 *   to: copy到哪里
 *   filter: 排除文件，
 * }
 * @param: optimization.runtimeChunk - 将运行时代码单独打包成一个文件
 * @param: optimization.minimize - 将告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩代码
 * @param: optimization.minimizer - 允许你通过提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)
 * @param: optimization.minimizer[0] - CssMinimizerPlugin - 压缩css代码
 * @see: https://github.com/webpack-contrib/css-minimizer-webpack-plugin
 * @param: optimization.minimizer[1] - TerserPlugin - 压缩js代码
 * @see: https://github.com/webpack-contrib/terser-webpack-plugin
 * {
 *   parallel: 开启多线程压缩
 *   terserOptions.compress.pure_funcs 删除某些代码例如 console.log
 * }
 * @param: splitChunks.cacheGroups.common - 提取页面公共代码
 * @param: splitChunks.cacheGroups.vendors - 提取node_modules代码
 * @param: splitChunks.cacheGroups.xxx.name - 生成的文件名字
 * @param: splitChunks.cacheGroups.xxx.chunks - 选择哪些 chunk 进行优化 一般写all 对同步和异步模块都进行抽离
 * @param: splitChunks.cacheGroups.xxx.minChunks - 被引用的最小次数
 * @param: splitChunks.cacheGroups.xxx.maxInitialRequests - 入口点的最大并行请求数。
 * @param: splitChunks.cacheGroups.xxx.minSize - 生成 chunk 的最小体积
 * @param: splitChunks.cacheGroups.xxx.priority - 提取优先级
 * @param: splitChunks.cacheGroups.xxx.enforce - 忽略 splitChunks.minSize、splitChunks.minChunks、splitChunks.maxAsyncRequests 和 splitChunks.maxInitialRequests 选项，并始终为此缓存组创建 chunk
 * @param: splitChunks.cacheGroups.xxx.reuseExistingChunk - 表示是否使用已有的 chunk，true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的
 * @param: cache.type - 缓存位置，生产环境一般是缓存到文件系统以便加快打包速度
 * @param: cache.buildDependencies.config - 配置文件发生改变时重新构建并生成缓存
 * @param: performance - webpack 如何通知「资源(asset)和入口起点超过指定文件限制」
 * @param: performance.hints - 性能提示形式
 * @param: performance.maxAssetSize - 根据单个资源体积(单位: bytes)，控制 webpack 生成性能提示
 * @param: performance.maxEntrypointSize - 根据入口起点的最大体积，控制 webpack 生成性能提示
 */
/** @type {import('webpack').Configuration} wepack配置代码提示 */
let config = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [getCssRule(MiniCssExtractPlugin.loader), getTsRule('thread-loader')],
  },
  plugins: [
    new CompressionPlugin({
      test: /.(js|css)$/,
      filename: '[path][base].gz',
      algorithm: 'gzip',
      threshold: 50 * 1024,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: resolveDir('public'),
          to: resolveDir('dist'),
          filter: (source) => !source.includes('index.html'),
        },
      ],
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'],
          },
        },
      }),
    ],
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
    type: 'filesystem',
    buildDependencies: {
      config: configFilenames.map((name) => resolveDir(name)),
    },
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 2 * 1024 * 1024,
    maxEntrypointSize: 2 * 1024 * 1024,
  },
});

/**
 * @param: plugins[0] - MiniCssExtractPlugin - 抽离css为单独文件 由于SpeedMeasurePlugin的某些bug，需要在smp.wrap执行后才能往plugins加MiniCssExtractPlugin
 * @see: https://github.com/webpack-contrib/mini-css-extract-plugin
 * {
 *   filename: 生成文件路径 + 文件名
 * }
 */
const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'static/css/[name].[contenthash:8].css',
});

if (isMeaSpeed) {
  /**
   * @see: https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
   * @description: 启用打包速度分析，测量打包各阶段耗时
   */
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
  const smp = new SpeedMeasurePlugin();
  config = smp.wrap(config);
}

if (isGenAnalyz) {
  /**
   * @param: plugins[3] - BundleAnalyzerPlugin - 分析打包文件大小、占比情况、各文件 Gzipped 后的大小、模块包含关系、依赖项等
   * @see: https://github.com/webpack-contrib/webpack-bundle-analyzer
   * {
   *   analyzerMode - 是否启动打包报告的http服务器
   *   generateStatsFile - 是否生成stats.json文件
   * }
   *
   */
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
    analyzerMode: 'disabled',
    generateStatsFile: true,
  });

  config.plugins.push(bundleAnalyzerPlugin);
}

config.plugins.unshift(miniCssExtractPlugin);

module.exports = config;
