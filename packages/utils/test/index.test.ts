import { tinypng } from '../index'
import { TTinifyParams } from '../../types/tinypng'
import { API_KEY as tinypngKey } from '../../config/tinypng'

const msg = '测试 tinypng 函数'
const file = './fuji.jpeg'
const successMsg = 'compress successfully'
let params: TTinifyParams = { file: './fuji.jpeg' }

beforeEach(() => {
    params = {
        file: './fuji.jpeg',
    }
})
afterEach(() => (params.proxy = ''))

describe(`${msg}只传源文件 command: jcli tp xxx.jpeg`, () => {
    test('只传源文件 command: jcli tp fuji.jpeg', async () => {
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
    test(`${msg}只传源文件 command: jcli tp xxx.webp`, async () => {
        params.file = './fuji.webp'
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
    test(`${msg}只传源文件 command: jcli tp xxx.jpg`, async () => {
        params.file = './fuji.jpg'
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
    test(`${msg}只传源文件 command: jcli tp xxx.png`, async () => {
        params.file = './fuji.png'
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
    test('传不存在的源文件 command: jcli tp fuji.svg', async () => {
        params.file = './fuji.svg'
        await expect(tinypng(params)).rejects.toThrowError()
    })
})

describe(`${msg}转换格式 command: jcli tp fuji.jpeg fuji.xx`, () => {
    beforeEach(() => {
        params = {
            file: './fuji.jpeg',
            destFile: './fuji.jpeg',
        }
    })
    test('转换 png 格式 command: jcli tp fuji.jpeg fuji.png', async () => {
        console.log('params', params)
        params.destFile = './fuji.png'
        const result = await tinypng(params)
        expect(result).toBe(successMsg)
    })

    test('转换 webp 格式 command: jcli tp fuji.jpeg fuji.webp', async () => {
        console.log('params', params)
        params.destFile = './fuji.webp'
        const result = await tinypng(params)
        expect(result).toBe(successMsg)
    })
    test('转换为不兼容的图片格式 command: jcli tp fuji.jpeg fuji.svg', async () => {
        console.log('params', params)
        params.destFile = './fuji.svg'
        await expect(tinypng(params)).rejects.toThrowError()
    })
})

describe(`${msg}使用不同 method`, () => {
    test('使用 scale command: jcli tp fuji.jpeg -m scale', async () => {
        params.method = 'scale'
        await expect(tinypng(params)).rejects.toThrowError()
    })
    test('使用 scale command: jcli tp fuji.jpeg -m scale -w 100', async () => {
        params.method = 'scale'
        params.width = 100
        const result = await tinypng(params)
        expect(result).toBe(successMsg)
    })
    test('使用 scale command: jcli tp fuji.jpeg -m scale -H 100', async () => {
        params.method = 'scale'
        params.height = 100
        const result = await tinypng(params)
        expect(result).toBe(successMsg)
    })

    test('使用 fit command: jcli tp fuji.jpeg -m fit', async () => {
        params.method = 'fit'
        await expect(tinypng(params)).rejects.toThrowError()
    })
    test('使用 fit command: jcli tp fuji.jpeg -m fit -w 100', async () => {
        params.method = 'fit'
        params.width = 100
        await expect(tinypng(params)).rejects.toThrowError()
    })
    test('使用 fit command: jcli tp fuji.jpeg -m fit -w 100 -H 100', async () => {
        params.method = 'fit'
        params.width = 100
        params.height = 100
        const result = await tinypng(params)
        expect(result).toBe(successMsg)
    })
    test('使用 cover command: jcli tp fuji.jpeg -m cover', async () => {
        params.method = 'cover'
        await expect(tinypng(params)).rejects.toThrowError()
    })
    test('使用 cover command: jcli tp fuji.jpeg -m cover -w 100', async () => {
        params.method = 'cover'
        params.width = 100
        await expect(tinypng(params)).rejects.toThrowError()
    })
    test('使用 cover command: jcli tp fuji.jpeg -m cover -w 100 -H 100', async () => {
        params.method = 'cover'
        params.width = 100
        params.height = 100
        const result = await tinypng(params)
        expect(result).toBe(successMsg)
    })
    test('使用 thumb command: jcli tp fuji.jpeg -m thumb', async () => {
        const result = await tinypng(params)
        expect(result).toBe(successMsg)
    })
    test('使用不存在的 command: jcli tp fuji.jpeg -m exist', async () => {
        const params: TTinifyParams = {
            file,
            /** @ts-ignore */
            method: 'exist',
        }
        await expect(tinypng(params)).rejects.toThrowError()
    })
})

describe(`${msg}使用 proxy`, () => {
    afterAll(() => {
        delete params.proxy
    })
    test('使用 proxy 为空', async () => {
        params.proxy = ''
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })

    test('使用 proxy 为 https://www.baidu.com', async () => {
        params.proxy = 'https://www.baidu.com'
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
})

describe(`${msg}使用 width/height`, () => {
    beforeEach(() => {
        params = {
            file: './fuji.jpeg',
        }
    })
    test('使用 width 没有设置 method', async () => {
        params.width = 100
        await expect(tinypng(params)).rejects.toThrowError()
    })
    test('使用 height 没有设置 method', async () => {
        params.height = 100
        await expect(tinypng(params)).rejects.toThrowError()
    })
    test('使用 width height 没有设置 method', async () => {
        params.height = 100
        params.width = 100
        await expect(tinypng(params)).rejects.toThrowError()
    })
})

// describe(`${msg}使用 错误的 key`, () => {
//     beforeEach(() => {
//         params.key = 'random-sdf'
//     })
//     test('使用错误的key', async () => {
//         await expect(tinypng(params)).rejects.toThrowError()
//     })
// })

describe(`${msg}使用 background color`, () => {
    beforeEach(() => {
        params = {
            file: './fuji.jpeg',
        }
    })
    test('使用背景色 yellow', async () => {
        params.backgroundColor = 'yellow'
        await expect(tinypng(params)).rejects.toThrowError()
    })
    test('使用背景色 white', async () => {
        params.backgroundColor = 'white'
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
    test('使用背景色 black', async () => {
        params.backgroundColor = 'black'
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
    test('使用背景色 hex', async () => {
        params.backgroundColor = '#c6c6c6'
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
})

describe(`${msg}使用 isPreserveMetaData`, () => {
    test('使用isPreserveMetaData', async () => {
        params.isPreserveMetaData = true
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
})

describe(`${msg}使用所有参数`, () => {
    let params: TTinifyParams = { file: './fuji.jpeg' }
    beforeEach(() => {
        params = {
            file: './fuji.jpeg',
            destFile: './fuji.webp',
            key: tinypngKey,
            proxy: '',
            ext: 'png',
            method: 'scale',
            width: 100,
            height: 100,
            backgroundColor: 'black',
            isPreserveMetaData: true,
        }
    })
    test('使用所有参数', async () => {
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
})

describe('测试目标文件已存在时', () => {
    test('jcli tp fuji.jpg fuji.png', async () => {
        params.destFile = './fuji.png'
        const result = await tinypng(params)
        return expect(result).toBe(successMsg)
    })
})
