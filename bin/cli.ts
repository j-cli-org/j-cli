#! /usr/bin/env node

// #! 符号的名称是 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的头文件

// import * as program from 'commander'
import { Command } from 'commander'
const program = new Command()

// 包信息
// const packageInfo as any = require('../package.json')
import packageInfo from '../package.json'
// 获取版本号
program.version(`v${packageInfo.version}`)
program.name('jcli').usage('<command> [option]')

// 配置命令
// 创建项目
program
    .command('create')
    .description('create a new project')
    .argument('<app-name>', 'app name')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        // console.log('created!', name, options)
        require('../packages/createApp/create')(name, options)
    })

// 解析用户实行命令传入参数
program.parse(process.argv)
// console.log('agrv', program.parse())
