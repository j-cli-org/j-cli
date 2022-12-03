import path from 'path'
// const fs = require('fs-extra')
import fs from 'fs'
import inquirer from 'inquirer'
import ora from 'ora'

// import downloadGitRepo from 'download-git-repo'
import util from 'util'

import FileUtil from '../utils/file'
import * as Utils from '../utils/index'

// const chalk = require('chalk')
// const figlet = require('figlet')

const { getRepoList } = require('../../lib/http')

type TQuestions = {
    name: string
    type: string
    message: string
    default?: boolean
    choices?: Record<string, string>[] | (() => void)
}[]

// 创建项目
async function create(name, options) {
    // 当前命令行选择的目录
    const cwd: string = process.cwd()
    console.log('cwd', cwd)

    const targetDir: string = path.join(cwd, name)
    console.log('target dir', targetDir)

    const questions: TQuestions = [
        {
            name: 'eslint',
            type: 'confirm',
            message: 'Do you want to use eslint?',
            default: true,
        },
        {
            name: 'commitlint',
            type: 'confirm',
            message: 'Do you want to use commitlint?',
            default: true,
        },
    ]

    if (fs.existsSync(targetDir)) {
        if (!options.force) {
            questions.push({
                name: 'overwrite',
                type: 'list',
                message: 'Target directory is already exist, please pick an action: ',
                choices: [
                    { name: 'Overwrite', value: 'overwrite' },
                    { name: 'Cancel', value: 'cancel' },
                ],
            })
        }
    }

    const answers = await inquirer.prompt(questions)

    console.log('answer', answers)
    if (answers.overwrite && answers.overwrite === 'cancel') return

    // 当目录已存在并且用户选择覆盖
    if (answers?.overwrite === 'overwrite') {
        const spinner = ora('Loading unicorns').start()
        spinner.color = 'yellow'
        spinner.text = '\nRemoving...'
        // await new Promise((resolve) => setTimeout(() => resolve(), 3000))
        await FileUtil.remove(targetDir)
        // await fs.rmdirSync(targetDir, { recursive: true })
        spinner.succeed('successfully overwrite')
    }
    Utils.loading({
        fn: _create,
        msg: 'Creating project...',
        errorMsg: 'Fetching failure... \n please retry.',
        successMsg: 'create successfully🎉🎉🎉',
    })({ name, options, answers, targetDir })

    async function _create(args) {
        const { name, options, answers, targetDir } = args
        const sourceDirMap = {
            common: path.resolve(__dirname, 'template/common'),
            eslint: path.resolve(__dirname, 'template/eslint'),
            commitlint: path.resolve(__dirname, 'template/commitlint'),
        }
        const devDependenciesMap = {
            eslint: {
                eslint: '^8.5.0',
                'eslint-config-prettier': '^8.3.0',
                'eslint-plugin-prettier': '^4.0.0',
                prettier: '^2.5.1',
            },
            commitlint: {
                '@commitlint/cli': '^15.0.0',
                '@commitlint/config-conventional': '^15.0.0',
                commitizen: '^4.2.4',
                'cz-conventional-changelog': '^3.3.0',
                'cz-customizable': '^6.3.0',
                husky: '^7.0.4',
                'lint-staged': '^12.1.2',
            },
        }

        fs.mkdirSync(targetDir)

        FileUtil.copy(sourceDirMap.common, targetDir)
        const pkgInfo = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'template/common/package.json'), 'utf-8'))
        pkgInfo.name = name
        if (answers.eslint) {
            Object.assign(pkgInfo.devDependencies, devDependenciesMap.eslint)
            FileUtil.copy(sourceDirMap.eslint, targetDir)
        }
        if (answers.commitlint) {
            Object.assign(pkgInfo.devDependencies, devDependenciesMap.commitlint)
            pkgInfo.scripts.prepare = 'husky install'
            FileUtil.copy(sourceDirMap.commitlint, targetDir)
        }

        fs.writeFileSync(path.resolve(targetDir, 'package.json'), JSON.stringify(pkgInfo))
    }
}

/* 从远端拉取模板 */
// async function downloadTemplate(targetDir) {
//     let repoList = []
//     try {
//         // const repo = await api.getRepoList()
//         repoList = await loading(getRepoList, 'Fetching template info...')
//     } catch (err) {
//         console.error('downloadTemplate error', err)
//     }

//     const repoNameList = repoList.map((repo) => repo.name)

//     const { name: repoName } = await inquirer.prompt([
//         {
//             name: 'name',
//             type: 'list',
//             choices: repoNameList,
//             message: 'please choose a template to create project.',
//         },
//     ])

//     const promiseDownloadGitRepo = util.promisify(downloadGitRepo)

//     console.log('repoName', repoName)
//     // 下载地址 - default -> master
//     const downloadUrl = `j-cli-org/${repoName}`

//     loading(
//         promiseDownloadGitRepo,
//         'waiting download template',
//         downloadUrl,
//         path.resolve(process.cwd(), targetDir)
//     )
// }

module.exports = create
