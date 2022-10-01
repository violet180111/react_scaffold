const { resolve } = require('path');

module.exports = {
  resolveDir: (path) => resolve(process.cwd(), path),
  getTsRule: (loader) => ({
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: [loader, 'babel-loader?cacheDirectory'].filter(Boolean),
  }),
  getCssRule: (loader) => ({
    test: /\.css$/,
    use: [loader, 'css-loader'],
  }),
};
