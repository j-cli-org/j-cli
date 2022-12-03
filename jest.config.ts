import type { Config } from 'jest'

const config: Config = {
    // verbose: false,
    transform: {
        // 使用 ts-jest 兼容 type-check
        '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
    },
    extensionsToTreatAsEsm: ['.ts'],
    testPathIgnorePatterns: ['./packages/quickcommander/'],
    rootDir: './',
    testTimeout: 10000,
}

export default config
