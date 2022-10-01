### 一个基于 webpack 的 react + typescript 简单自定义脚手架 ✌️

#### ✨ 特性

- 支持代码检查
- 支持代码格式化
- 内置**emotion**语法和**antd**组件
- 代码提交前对代码进行 **eslint** 检查修复和格式化

#### 📁 文件结构

|         文件(夹)         |        描述         |
| :----------------------: | :-----------------: |
|        **.husky**        |   **husky** 配置    |
|        **config**        |  **webpack** 配置   |
|        **public**        | 静态资源（图片等）  |
|         **src**          |    主要业务代码     |
|    **.eslintignore**     | 忽略**eslint**检查  |
|     **.eslintrc.js**     |   **eslint**配置    |
|      **.gitignore**      |   忽略**git**提交   |
|   **.lintstagedrc.js**   | **git**提交前的操作 |
|   **.prettierignore**    |   忽略代码格式化    |
|    **.prettierrc.js**    |  **prettierr**配置  |
|   **babel.config.js**    |    **babel**配置    |
| **commitlint.config.js** | **git commit**配置  |
|     **package.json**     |      项目配置       |
|    **tsconfig.json**     |     **ts** 配置     |
