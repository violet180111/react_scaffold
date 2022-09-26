const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { resolveDir } = require('../js/utils');
const { printInstructions, formatWebpackMessages } = require('../js/webpackDevServerUtils');
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
      const { port, https } = stats.compilation.options.devServer;
      const rootDir = resolveDir('.');
      const logInfo = {
        appName: rootDir.slice(rootDir.lastIndexOf('\\') + 1),
        protocol: `${https ? 'https' : 'http'}://`,
        host: 'localhost',
        port,
        localIPv4,
        localIPv6,
      };

      if (isSuccessful) {
        printInstructions(logInfo);
      }

      // If errors exist, only show errors.
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        console.log(chalk.red('Failed to compile.\n'));
        console.log(messages.errors.join('\n\n'));
        return;
      }

      // Show warnings if no errors were found.
      if (messages.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(messages.warnings.join('\n\n'));

        // Teach some ESLint tricks.
        console.log(
          '\nSearch for the ' + chalk.underline(chalk.yellow('keywords')) + ' to learn more about each warning.',
        );
        console.log('To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n');
      }
    });
  }
}

module.exports = LogsPlugin;
