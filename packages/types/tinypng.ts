import tinify from 'tinify'

export type TTinifyParams = {
    file: string
    destFile?: string
    key?: string
    proxy?: string
    ext?: ['webp', 'jpeg', 'png', 'jpg'] | 'webp' | 'jpeg' | 'png' | 'jpg'
    method?: 'scale' | 'fit' | 'cover' | 'thumb'
    width?: number
    height?: number
    backgroundColor?: string
    isPreserveMetaData?: boolean
}

export type TTinifyError = typeof tinify.Error | typeof tinify.AccountError | typeof tinify.ClientError | typeof tinify.ServerError | typeof tinify.ConnectionError
