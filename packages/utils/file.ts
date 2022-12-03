import path from 'path'

import fs from 'fs'

/**
 * @param src source filename to copy
 * @param dest destination filename of the copy operation
 */
function copy(src: string, dest: string): void {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
        copyDir(src, dest)
    } else {
        fs.copyFileSync(src, dest)
    }
}

/**
 * @param src source filename to copy
 * @param dest destination filename of the copy operation
 */
function copyDir(srcDir: string, destDir: string): void {
    fs.mkdirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file)
        const destFile = path.resolve(destDir, file)
        copy(srcFile, destFile)
    }
}

function remove(src: string): void {
    if (!fs.existsSync(src)) return
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
        if (!fs.readdirSync(src).length) return fs.rmdirSync(src)
        for (const file of fs.readdirSync(src)) {
            remove(path.resolve(src, file))
        }
    } else {
        fs.rmSync(src)
    }
}

function getFileExt(file: string): string {
    const fileName: string = path.basename(file)
    const arr: string[] = fileName.split('.')
    return arr[arr.length - 1]
}

function getFileName(file: string): string {
    const fileName: string = path.basename(file)
    const arr: string[] = fileName.split('.')
    arr.pop()
    return arr.join('.')
}

function getInfo(file: string) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(file)) return reject('file does not exist.')

        const stat: fs.Stats = fs.statSync(file)
        const info = {
            isFile: stat.isFile(),
            isDir: stat.isDirectory(),
            fileNme: getFileName(file),
            fileExt: getFileExt(file),
        }
        resolve(info)
    })
}

export default {
    copy,
    copyDir,
    remove,
    getFileExt,
    getFileName,
    getInfo,
}
