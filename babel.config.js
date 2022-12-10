/**
 * 更多内容 @see: https://webpack.docschina.org/
 * @param presets - babel插件集合的预设,包含某一部分的插件plugin
 * @see https://github.com/babel/babel
 * @param presets[0] - @babel/preset-env - babel插件集合
 * {
 *    targets: 描述项目支持的浏览器环境
 *    useBuiltIns: 根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
 *    corejs: corejs版本
 * }
 * @param presets[1] - @babel/preset-react - 所有 react 插件的 babel 预设
 * {
 *    runtime: 不再需要在react文件顶层引入React
 *    importSource: 写上这句配置之后使用emotion就可以不用在文件顶部写  @jsxImportSource @emotion/react
 * }
 * @param presets[2] - @babel/preset-typescript - typeScript 的 babel 预设
 * @param plugins - 用于转换代码
 * @param plugins[0] - babel-plugin-import- 为组件库实现单组件按需加载并且自动引入其样式
 * {
 *    libraryName: 包名
 *    libraryDirectory: 目录
 *    libraryName: 是否引入 style
 * }
 *
 *@param plugins[1] - @babel/plugin-transform-runtime - 自动移除语法转换后内联的辅助函数（inline Babel helpers），使用@babel/runtime/helpers里的辅助函数来替代
 *{
 *    corejs: 设置是否做API转换以避免污染全局环境
 *}
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: browserslist[ENV],
        useBuiltIns: 'usage',
        corejs: '3',
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        importSource: '@emotion/react',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    // 按需引入antd css
    // 配置默认使用emotion语法 使用less的话可以把下面的换成
    // {
    //   libraryName: 'antd',
    //   libraryDirectory: 'es',
    //   style: true,
    // },
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
      },
    ],
    ENV === 'development' && 'react-refresh/babel',
  ].filter(Boolean),
};
