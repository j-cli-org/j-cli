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

export default {
    copy,
    copyDir,
    remove,
}
