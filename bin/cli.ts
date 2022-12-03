#! /usr/bin/env node

// #! 符号的名称是 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的头文件

import { Command } from 'commander'
const program = new Command()

import tinypng from '../packages/tinypng/index'

// 包信息
// const packageInfo as any = require('../package.json')
import packageInfo from '../package.json'
// 获取版本号
program.version(`v${packageInfo.version}`)
program.name('jcli').usage('<command> [options]')

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

// 压缩图片
program
    .command('tp')
    .description('compress your image')
    .argument('<image-path>', 'image path')
    .argument('[destination-image-path]', 'destination image path')
    .option('-p, --proxy <proxy>', 'make all request over the proxy')
    .option('-m, --method <method>', 'choose a resize method between scale, fit, cover, and thumb')
    .option('-W, --width <width>', 'set the image width')
    .option('-H, --height <height>', 'set the image height')
    .option('-bg, --background <background-color>', 'set the image background color')
    .option('-pres, --preserve', 'copied meta data from the source image')
    .action((file: string, destFile: string, options: Record<string, string | boolean>) => {
        console.log('tinypng!', `file: ${file} destFile: ${destFile}`, `options: ${JSON.stringify(options)}`)
        tinypng(file, destFile, options)
    })

// 解析用户实行命令传入参数
program.parse(process.argv)
// console.log('agrv', program.parse())
