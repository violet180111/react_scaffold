const fs = require('fs');
const { clear } = require('../js/utils');
const { ProgressPlugin } = require('webpack');

/**
 * @description: 自定义启动(构建)进度插件
 */
class ProgressBarPlugin {
  /**
   * @param {number} options.width 进度条宽度
   * @param {string} options.char  进度条字符
   * @param {boolean} options.isDev 是否是开发环境
   */
  constructor(options = {}) {
    const { width = 20, char = '=', isDev = true } = (this.options = options);

    if (typeof width !== 'number') {
      throw TypeError('width must be a number');
    }

    if (typeof char !== 'string') {
      throw TypeError('char must be a string');
    }

    if (char.length > 2 || char.length < 1) {
      throw Error("char's length must be 1 or 2");
    }

    this.progress = 0;
    this.fullProgress = 100;
    this.spaceBufferCount = 10;
    this.char = char;
    this.width = width / char.length;
    this.onSpaceToProgress = this.fullProgress / this.width;

    return Object.assign(new ProgressPlugin((percentage) => this.update((this.progress = percentage))), {
      getProgress: () => this.progress,
    });
  }

  /**
   * @description: 获取输出进度
   * @param {number} progress 进度
   */
  getOutput(progress) {
    const exactProgress = progress * 100;
    const progressCount = Math.floor(exactProgress / this.onSpaceToProgress);
    const space = this.char.length === 1 ? ' ' : '  ';
    let output = '';

    for (let i = 0; i < this.width; i++) {
      output += i >= progressCount ? space : this.char;
    }

    return `🚀 ${this.options.isDev ? '启动' : '构建'}进度 [${output}] ${exactProgress.toFixed(0)}%`;
  }

  /**
   * @description: 更新进度
   * @param {number} progress 进度
   */
  update(progress = 0) {
    const output = this.getOutput(progress);

    clear();
    progress !== 1 && console.log(output);
  }
}

module.exports = ProgressBarPlugin;
