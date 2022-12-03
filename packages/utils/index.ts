import tinify from 'tinify'
import Source from 'tinify/lib/tinify/Source'
import chalk from 'chalk'
import ora from 'ora'

import { API_KEY as tinypngKey } from '../config/tinypng'
import FileUtil from './file'

/** types */
import { TTinifyParams } from '../types/tinypng'

const error = chalk.redBright.bold
const errorDim = chalk.red.dim
const success = chalk.greenBright.bold

/**
 * @desc 压缩图片
 * @param {object} params
 * @param {string} params.file source file
 * @param {string} params.destFile destination file name
 * @param {string} params.key necessary api key, check below this website [https://tinypng.com/developers]
 * @param {string} params.proxy make all request over the proxy
 * @param {string} params.ext convert images to your desired image type, currently support WebP, JPEG, and PNG.
 * @param {string} params.method the method describe the way your image will be resized.
 * @param {number} params.width
 * @param {number} params.height
 * @param {string} params.backgroundColor
 * @param {boolean} params.isPreserveMetaData whether copied meta data from the source image currently support copyright, creation, location (JPEG ONLy)
 */
export async function tinypng(params: TTinifyParams): Promise<string> {
    try {
        const { key } = params

        tinify.key = key || tinypngKey

        await c2p(tinify.validate, tinify)()

        console.log(success('through validate'))

        let ext: string | string[], source: Source
        let fileName: string = params.destFile ? FileUtil.getFileName(params.destFile) : `${FileUtil.getFileName(params.file)}_tinify`

        if (params.proxy) tinify.proxy = params.proxy
        if (['http', 'https'].includes(params.file)) {
            source = tinify.fromUrl(params.file)
        } else {
            source = tinify.fromFile(params.file)
        }
        console.log(success('through from file'))

        if (params.method || params.height || params.width) {
            if (!params.method) {
                throw new Error('Please provide resize method')
            } else {
                if (params.method !== 'thumb' && !params.height && !params.width) {
                    throw new Error('Please provide either a target width or a target height')
                }
                if (['fit', 'cover'].includes(params.method) && (!params.height || !params.width)) {
                    throw new Error('Please provide both target width and target height')
                }
                const resizeParams: Record<string, string | number> = {
                    method: params.method,
                }
                if (params.height) resizeParams.height = params.height
                if (params.width) resizeParams.height = params.width
                source = source.resize(resizeParams)
            }
        }

        console.log(success('through resize'))
        if (params.ext) {
            if (Array.isArray(params.ext)) {
                ext = []
                params.ext.forEach((currentExt) => {
                    ;(ext as string[]).push(`image/${FileUtil.getFileExt(currentExt)}`)
                })
            } else {
                ext = `image/${FileUtil.getFileExt(params.ext)}`
            }

            if (params.backgroundColor) {
                let color: string
                if (['white', 'black'].includes(params.backgroundColor)) {
                    color = params.backgroundColor === 'white' ? '#ffffff' : '#000000'
                }
                source = source.convert({ type: ext }).transform({ background: color })
            } else {
                source = source.convert({ type: ext })
            }

            console.log(success('through convert'))

            const fileExt = (await source.result().extension()) as string
            if (params.isPreserveMetaData) {
                if (fileExt === 'jpg' || fileExt === 'jpeg') {
                    source.preserve('copyright', 'creation', 'location')
                } else {
                    source.preserve('copyright', 'creation')
                }
            }
            console.log(success('through preserve metadata'))
            fileName += `.${fileExt}`
        }

        console.log('filename', fileName + `.${FileUtil.getFileExt(params.file)}`)

        await c2p(source.toFile, source)(fileName + `.${FileUtil.getFileExt(params.file)}`)

        console.log(chalk.yellowBright('compress count: '), tinify.compressionCount)
        console.log(success('compress successfully'))
        return Promise.resolve('compress successfully')
    } catch (e: unknown) {
        console.log(error(`[error] ${(e as Error).message}\n`), errorDim((e as Error).stack))
        return Promise.reject(e)
    }
}

/**
 * @desc callback to promise
 * @param {function} callback
 * @param {object} context
 */
export function c2p(callback, context) {
    return (...args: any[]): Promise<any> => {
        return new Promise((resolve, reject) => {
            callback.call(context, ...args, (err) => (err ? reject(err) : resolve(err)))
        })
    }
}

/**
 * @desc 打印loading
 * @param {any} fn
 */
//
export function loading({ fn, msg = 'loading...', errorMsg = '', successMsg = '' }) {
    return async (params) => {
        const spinner = ora(msg)
        spinner.start()
        try {
            const result = await fn(params)
            spinner.succeed(successMsg)
            return result
        } catch (e) {
            console.log('error', e)
            spinner.fail(errorMsg)
        }
    }
}
