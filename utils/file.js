const path = require('path')

const fs = require('fs')

/**
 * @param src source filename to copy
 * @param dest destination filename of the copy operation
 */
function copy(src, dest) {
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
function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file)
        const destFile = path.resolve(destDir, file)
        copy(srcFile, destFile)
    }
}

function remove(src) {
    if (!fs.existsSync(src)) return
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
        if (!fs.readdirSync(src).length) return fs.rmdirSync(src)
        for (let file of fs.readdirSync(src)) {
            remove(path.resolve(src, file))
        }
    } else {
        fs.rmSync(src)
    }
}

module.exports = {
    copy,
    copyDir,
    remove,
}
