const { resolveDir } = require('./utils');

module.exports = {
  root: resolveDir('.'),
  src: resolveDir('src'),
  public: resolveDir('public'),
  entry: resolveDir('src/index.tsx'),
  output: resolveDir('dist'),
  htmlTemplate: resolveDir('public/index.html'),
  htmlStartUp: resolveDir('config/start-up.html'),
  tsBuildInfoFile: resolveDir('node_modules/.cache/tsconfig.tsbuildinfo'),
  font: resolveDir('config/fonts/3D-ASCII.flf'),
};
