const WebpackDevServer = require('webpack-dev-server');
const { resolveDir, clear } = require('../js/utils');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { printInstructions, formatWebpackMessages } = require('../js/webpackDevServerUtils');
const chalk = require('chalk');
const paths = require('../js/paths');
const localIPv4 = WebpackDevServer.internalIPSync('v4');
const localIPv6 = WebpackDevServer.internalIPSync('v6');

class LogsPlugin {
  apply(compiler) {
    ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler).waiting.tap('awaitingTypeScriptCheck', () => {
      console.log(chalk.yellow('Files successfully emitted, waiting for typecheck results...'));
    });

    compiler.hooks.afterDone.tap('LogsPlugin', (stats) => {
      const statsData = stats.toJson({
        all: false,
        warnings: true,
        errors: true,
      });
      const messages = formatWebpackMessages(statsData);
      const isSuccessful = !messages.errors.length && !messages.warnings.length;
      const { port, https, historyApiFallback } = stats.compilation.options.devServer;
      const rootDir = paths.root;
      const logInfo = {
        appName: rootDir.slice(rootDir.lastIndexOf('\\') + 1),
        protocol: `${https ? 'https' : 'http'}://`,
        host: 'localhost',
        port,
        historyApiFallback,
        localIPv4,
        localIPv6,
      };

      if (isSuccessful) {
        printInstructions(logInfo);
      }

      if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        console.log(chalk.red('Failed to compile.\n'));
        console.log(messages.errors.join('\n\n'));
        return;
      }

      if (messages.warnings.length) {
        console.log(
          '\nSearch for the ' + chalk.underline(chalk.yellow('keywords')) + ' to learn more about each warning.',
        );
        console.log('To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n');
      }
    });
  }
}

module.exports = LogsPlugin;
