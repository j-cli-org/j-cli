#! /usr/bin/env node

// #! 符号的名称是 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的头文件

const program = require('commander')

// 包信息
const packageInfo = require('../package.json')

// 获取版本号
program.version(`v${packageInfo.version}`)
program.name('j-cli').usage('<command> [option]')

// 配置命令
program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    require('../lib/create.js')(name, options)
  })

// 解析用户实行命令传入参数
program.parse(process.argv)
