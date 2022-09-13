const { resolve } = require('path');
const { merge } = require('webpack-merge');
const threadLoader = require('thread-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const resolveDir = (path) => resolve(__dirname, path);
const baseWebpackConfig = require('./webpack.base.conf');
const { getCssRule, getJsRule } = require('./getBaseConfig');
const { IS_GEN_BUNDLE, IS_MEA_SPEED } = process.env;
const isGenAnalyz = JSON.parse(IS_GEN_BUNDLE ?? false);
const isMeaSpeed = JSON.parse(IS_MEA_SPEED ?? false);
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
    workers: 2, // 线程实例
    workerParallelJobs: 50, // 每个线程可并发执行的最大任务数
  },
  [
    // 子进程中需要预加载的 node 模块
    'babel-loader',
  ],
);

/** @type {import('webpack').Configuration} wepack配置代码提示 */
const config = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [getCssRule(MiniCssExtractPlugin.loader), getJsRule('thread-loader')],
  },
  plugins: [
    new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      test: /.(js|css)$/, // 只生成css,js压缩文件
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8, // 压缩率,默认值是 0.8
    }),
    new CopyPlugin({
      patterns: [
        {
          from: resolveDir('../public'), // copy public文件夹
          to: resolveDir('../dist'), // copy到 dist文件夹
          filter: (source) => !source.includes('index.html'), // 过滤index.html
        },
      ],
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
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'], // 删除console.log
          },
        },
      }),
    ],
    splitChunks: {
      // 代码分包
      cacheGroups: {
        // 提取页面公共代码
        common: {
          name: 'chunk-common',
          chunks: 'all',
          minChunks: 2, // 只要使用2次就提取出来
          maxInitialRequests: 5,
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1, // 提取优先级为1
          enforce: true, // 忽略 splitChunks.minSize、splitChunks.minChunks、splitChunks.maxAsyncRequests 和 splitChunks.maxInitialRequests 选项，并始终为此缓存组创建 chunk
          reuseExistingChunk: true, // 当前 chunk 包含是从主 bundle 中拆分出的模块，则它将被重用
        },
        vendors: {
          name: 'chunk-vendors', // 提取文件命名为chunk-vendors.js后缀和chunkhash会自动加
          test: /[\\/]node_modules[\\/]/, // 提取node_modules代码
          chunks: 'all',
          priority: 2, // 提取优先级为2
          enforce: true, // 忽略 splitChunks.minSize、splitChunks.minChunks、splitChunks.maxAsyncRequests 和 splitChunks.maxInitialRequests 选项，并始终为此缓存组创建 chunk
          reuseExistingChunk: true, // 当前 chunk 包含是从主 bundle 中拆分出的模块，则它将被重用
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
    // 编译时警告
    hints: 'warning', // 提示形式
    maxAssetSize: 2 * 1024 * 1024, // 总资源大小超过该值发出警告
    maxEntrypointSize: 2 * 1024 * 1024, // 入口文件大小超过改值发出警告
  },
});

/**
 * @see: https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
 */
const configWithTimeMeasures = smp.wrap(config);
configWithTimeMeasures.plugins.unshift(
  new MiniCssExtractPlugin({
    filename: 'assets/css/[name].[contenthash:8].css',
  }),
);

module.exports = isMeaSpeed ? configWithTimeMeasures : config;
