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
  clear: () => {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
  },
};
