module.exports = {
  getJsRule: (loader) => ({
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: [loader, 'babel-loader'].filter(Boolean),
  }),
  getCssRule: (loader) => ({
    test: /\.css$/,
    use: [loader, 'css-loader'],
  }),
};
