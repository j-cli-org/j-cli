import * as Utils from '../utils/index'

export default async function tinypng(file: string, destFile: string, options: Record<string, string | boolean>) {
    const params = {
        file: file,
        destFile: destFile,
    }
    await Utils.loading({
        fn: Utils.tinypng,
        msg: 'compressing image...\n',
        errorMsg: 'Fetching failure... \n please retry.',
        successMsg: 'compress image successfully🎉🎉🎉',
    })(params)
}
