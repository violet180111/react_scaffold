const url = require('url');
const chalk = require('chalk');
const { projectMark } = require('./constants');

function printInstructions(logInfo = {}) {
  const { appName, protocol, host, port, localIPv4, localIPv6 } = logInfo;
  const getUrl = (info, isIPv6 = false) => (isIPv6 ? `${protocol}[${info}]:${port}` : `${protocol}${info}:${port}`);
  const showTitleWithGreenBright = (title) => chalk.greenBright(chalk.bold(title));
  const showContentWithCyanBright = (content) => chalk.cyanBright(chalk.bold(content));

  console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
  console.log();
  console.log(
    `  ${showTitleWithGreenBright(`[${projectMark}]`)} ${showTitleWithGreenBright(
      'Local:',
    )}                   ${showContentWithCyanBright(getUrl(host))}`,
  );
  console.log(
    `  ${showTitleWithGreenBright(`[${projectMark}]`)} ${showTitleWithGreenBright(
      'On Your Network (IPv4):',
    )}  ${showContentWithCyanBright(getUrl(localIPv4))}`,
  );
  localIPv6 &&
    console.log(
      `  ${showTitleWithGreenBright(`[${projectMark}]`)} ${showTitleWithGreenBright(
        'On Your Network (IPv6):',
      )}  ${showContentWithCyanBright(getUrl(localIPv6, true))}`,
    );
  console.log(
    `  ${showTitleWithGreenBright(`[${projectMark}]`)} ${showTitleWithGreenBright(
      '404s will fallback to',
    )} ${showContentWithCyanBright("'/index.html'")}`,
  );
  console.log();
  console.log('Note that the development build is not optimized.');
  console.log(`To create a production build, use ${chalk.cyan('npm run build')}.`);
  console.log();
}

const friendlySyntaxErrorLabel = 'Syntax error:';

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

function formatMessage(message) {
  let lines = [];

  if (typeof message === 'string') {
    lines = message.split('\n');
  } else if ('message' in message) {
    lines = message['message'].split('\n');
  } else if (Array.isArray(message)) {
    message.forEach((message) => {
      if ('message' in message) {
        lines = message['message'].split('\n');
      }
    });
  }

  lines = lines.filter((line) => !/Module [A-z ]+\(from/.test(line));

  lines = lines.map((line) => {
    const parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(line);
    if (!parsingError) {
      return line;
    }
    const [, errorLine, errorColumn, errorMessage] = parsingError;
    return `${friendlySyntaxErrorLabel} ${errorMessage} (${errorLine}:${errorColumn})`;
  });

  message = lines.join('\n');
  message = message.replace(/SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g, `${friendlySyntaxErrorLabel} $3 ($1:$2)\n`);
  message = message.replace(
    /^.*export '(.+?)' was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$2'.`,
  );
  message = message.replace(
    /^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$2' does not contain a default export (imported as '$1').`,
  );
  message = message.replace(
    /^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$3' (imported as '$2').`,
  );
  lines = message.split('\n');

  if (lines.length > 2 && lines[1].trim() === '') {
    lines.splice(1, 1);
  }
  lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, '$1');

  if (lines[1] && lines[1].indexOf('Module not found: ') === 0) {
    lines = [
      lines[0],
      lines[1].replace('Error: ', '').replace('Module not found: Cannot find file:', 'Cannot find file:'),
    ];
  }

  if (lines[1] && lines[1].match(/Cannot find module.+sass/)) {
    lines[1] = 'To import Sass files, you first need to install sass.\n';
    lines[1] += 'Run `npm install sass` or `yarn add sass` inside your workspace.';
  }

  message = lines.join('\n');
  message = message.replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm, ''); // at ... ...:x:y
  message = message.replace(/^\s*at\s<anonymous>(\n|$)/gm, ''); // at <anonymous>
  lines = message.split('\n');

  lines = lines.filter(
    (line, index, arr) => index === 0 || line.trim() !== '' || line.trim() !== arr[index - 1].trim(),
  );

  message = lines.join('\n');
  return message.trim();
}

function formatWebpackMessages(json) {
  const formattedErrors = json.errors.map(formatMessage);
  const formattedWarnings = json.warnings.map(formatMessage);
  const result = { errors: formattedErrors, warnings: formattedWarnings };
  if (result.errors.some(isLikelyASyntaxError)) {
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }
  return result;
}

module.exports = { printInstructions, formatWebpackMessages };
