const path = require('path')

const fs = require('fs')

/**
 * @param src source filename to copy
 * @param dest destination filename of the copy operation
 */
function copy(src: string, dest: string) {
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
function copyDir(srcDir: string, destDir: string) {
    fs.mkDirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file)
        const destFile = path.resolve(destDir, file)
        copy(srcFile, destFile)
    }
}

module.exports = {
    copy,
    copyDir,
}
