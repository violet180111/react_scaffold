const browserslist = {
  production: ['>0.2%', 'not dead', 'not op_mini all'],
  development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
};
const ENV = process.env.NODE_ENV;

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 项目所支持的浏览器的配置
        targets: browserslist[ENV],
        useBuiltIns: 'usage',
        corejs: '3',
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        // 写上这句配置之后使用emotion就可以不用在文件顶部写/* @jsxImportSource @emotion/react */
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
        helpers: true,
        regenerator: true,
      },
    ],
    ENV === 'development' && 'react-refresh/babel',
  ].filter(Boolean),
};
