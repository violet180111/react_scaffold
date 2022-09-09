module.exports = {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'merge',
        'sync',
        'impr',
      ],
    ],
  },
  prompt: {
    settings: {},
    messages: {
      skip: '(可跳过)',
      max: '最大 %d 个字符',
      min: '至少 %d 个字符',
      emptyWarning: '不能为空',
      upperLimitWarning: '超过限制',
      lowerLimitWarning: '低于限制',
    },
    questions: {
      type: {
        description: '选择你的提交类型',
        enum: {
          feat: {
            description: '新增功能，迭代项目需求',
            title: '新增',
          },
          fix: {
            description: '修复缺陷，修复上一版本存在问题',
            title: '修复',
          },
          docs: {
            description: '更新文档，仅修改文档不修改代码',
            title: '文档',
          },
          style: {
            description: '变动格式，不影响代码逻辑',
            title: '格式',
          },
          refactor: {
            description: '重构代码，非新增功能也非修复缺陷',
            title: '重构',
          },
          perf: {
            description: '优化性能，提高代码执行性能',
            title: '性能',
          },
          test: {
            description: '新增测试，追加测试用例验证代码',
            title: '测试',
          },
          build: {
            description: '更新构建，改动构建工具或外部依赖',
            title: '构建',
          },
          ci: {
            description: '更新脚本，改动CI或执行脚本配置',
            title: '脚本',
          },
          chore: {
            description: '变动事务，改动其他不影响代码的事务',
            title: '事务',
          },
          revert: {
            description: '回滚版本，撤销某次代码提交',
            title: '回滚',
          },
          merge: {
            description: '合并分支，合并分支代码到其他分支',
            title: '合并',
          },
          sync: {
            description: '同步分支，同步分支代码到其他分支',
            title: '同步',
          },
          impr: {
            description: '改进功能，升级当前功能模块',
            title: '改进',
          },
        },
      },
      scope: {
        description: '这一变化的范围是什么(如组件或文件名)?',
      },
      subject: {
        description: '简短的变化描述',
      },
      body: {
        description: '较长的变化描述',
      },
    },
  },
};
