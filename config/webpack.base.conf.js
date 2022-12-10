const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const paths = require('./js/paths');
const { resolveDir } = require('./js/utils');
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const hash = isProd ? '.[contenthash:8]' : ''; // 计算hash值也会损耗一定性能
const configFilenames = [
  'config/webpack.base.conf.js',
  'config/webpack.dev.conf.js',
  'config/webpack.prod.conf.js',
  'babel.config.js',
  'tsconfig.json',
];
/**
 * 更多内容 @see: https://webpack.docschina.org/
 * @param entry - 入口文件路径
 * @param output.path - 生成文件父路径
 * @param output.filename - 生成文件子路径 + 文件名
 * @param output.chunkFilename - 生成文件子路径 + chunk 文件名
 * @param output.clean - 自动清空输出目录 webpack5不用再配置 clean-webpack-plugin
 * @param module.rules - 模块构建规则
 * @param module.rules.test - 文件名匹配正则
 * @param module.rules.type - 设置类型用于匹配模块 https://webpack.docschina.org/configuration/module/#ruletype
 * @param module.rules.generator.filename - 输出文件位置以及文件名
 * @param module.rules.parser.dataUrlCondition.maxSize - 超过多大不转 base64
 * @param module.rules.resourceQuery - import Test from './test.svg?url' 需要符合?url才启用这个rule
 * @param plugins[0] - HtmlWebpackPlugin - 生产html文件并注入对应css、js文件
 * @see https://github.com/jantimon/html-webpack-plugin
 * {
 *   inject: 文件插入位置
 *   template: 以哪个html文件为模板创建
 *   filename" 输出的html文件名字
 * }
 * @param plugins[1] - ForkTsCheckerWebpackPlugin - 加速TypeScript类型检查（通过将其移至单独的进程）、使用代码帧格式化程序显示漂亮的错误消息
 * @see https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
 * {
 *   async: 如果为true，在webpack的编译完成后报告问题。由于这一点，它不会阻碍编译。只在观察模式下使用。
 *   typescript: @see https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#typescript-options
 *   issue.include: 匹配文件
 *   issue.exclude: 排除文件
 *   logger: 类似于console.log，异步输出信息
 * }
 * @param resolve.modules - 告诉 webpack 解析模块时应该搜索的目录
 * @param resolve.extensions - 文件匹配优先级 例如import xxx from './test' 首先是找 test.ts 再是 test.tsx
 * @param resolve.alias - 路径别名 @/ === src/
 * @param cache.type - 缓存位置，生产环境一般是缓存到文件系统以便加快打包速度
 * @param cache.buildDependencies.config - 配置文件发生改变时重新构建并生成缓存
 * @param performance.hint - 性能提示形式
 */
/** @type {import('webpack').Configuration} wepack配置代码提示 */
module.exports = {
  entry: paths.entry,
  output: {
    path: paths.output,
    filename: `static/js/[name]${hash}.js`,
    chunkFilename: `static/js/[name]${hash}.chunk.js`,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(bmp|jpe?g|png|gif)$/,
        type: 'asset',
        generator: {
          filename: `static/media/images/[name]${isProd ? '.[hash]' : ''}[ext]`,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024,
          },
        },
      },
      {
        test: /\.svg$/,
        type: 'asset',
        generator: {
          filename: `static/media/images/[name]${isProd ? '.[hash]' : ''}[ext]`,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: `static/media/fonts/[name]${hash}[ext]`,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.htmlTemplate,
      filename: 'index.html',
    }),
    new ForkTsCheckerWebpackPlugin({
      async: isDev,
      typescript: {
        configOverwrite: {
          compilerOptions: {
            skipLibCheck: true,
            inlineSourceMap: false,
            declarationMap: false,
            noEmit: true,
            incremental: true,
            tsBuildInfoFile: paths.tsBuildInfoFile,
          },
        },
        context: paths.root,
        diagnosticOptions: {
          syntactic: true,
        },
        mode: 'write-references',
        // profile: true,
      },
      issue: {
        include: [{ file: '../**/src/**/*.{ts,tsx}' }, { file: '**/src/**/*.{ts,tsx}' }],
        exclude: [
          { file: '**/src/**/__tests__/**' },
          { file: '**/src/**/?(*.){spec|test}.*' },
          { file: '**/src/setupProxy.*' },
          { file: '**/src/setupTests.*' },
        ],
      },
      logger: {
        infrastructure: 'silent',
      },
    }),
  ],
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', 'json'],
    alias: {
      '@': paths.src,
    },
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: configFilenames.map((name) => resolveDir(name)),
    },
  },
  performance: {
    hints: false,
  },
};
