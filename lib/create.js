const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const ora = require('ora')
const downloadGitRepo = require('download-git-repo')
const util = require('util')

// const chalk = require('chalk')
// const figlet = require('figlet')

const { getRepoList } = require('./http')

// 创建项目
async function create(name, options) {
  // 执行创建命令

  // 当前命令行选择的目录
  const cwd = process.cwd()
  console.log('cwd', cwd)

  const targetDir = path.join(cwd, name)

  // 已存在目录
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
      downloadTemplate(targetDir)
    } else {
      //  TODO -询问用户是否需要覆盖
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite',
            },
            {
              name: 'Cancel',
              value: 'cancel',
            },
          ],
        },
      ])
      if (!action) return

      if (action === 'overwrite') {
        const spinner = ora('Loading unicorns').start()
        spinner.color = 'yellow'
        spinner.text = '\nRemoving...'
        await fs.remove(targetDir)
        spinner.succeed('successfully overwrite')

        downloadTemplate(targetDir)
      }
    }
  } else {
    downloadTemplate(targetDir)
  }
}

/* 从远端拉取模板 */
async function downloadTemplate(targetDir) {
  let repoList = []
  try {
    // const repo = await api.getRepoList()
    repoList = await loading(getRepoList, 'Fetching template info...')
  } catch (err) {}

  const repoNameList = repoList.map((repo) => repo.name)

  const { name: repoName } = await inquirer.prompt([
    {
      name: 'name',
      type: 'list',
      choices: repoNameList,
      message: 'please choose a template to create project.',
    },
  ])

  const promiseDownloadGitRepo = util.promisify(downloadGitRepo)

  console.log('repoName', repoName)
  // 下载地址 - default -> master
  const downloadUrl = `j-cli-org/${repoName}`

  loading(
    promiseDownloadGitRepo,
    'waiting download template',
    downloadUrl,
    path.resolve(process.cwd(), targetDir)
  )
}

/* 打印loading */
async function loading(fn, msg, ...args) {
  const spinner = ora(msg)
  spinner.start()
  try {
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch (e) {
    console.log('error', e)
    spinner.fail('Fetching failure... \n please retry.')
  }
}

module.exports = create
