module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 13,
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'prettier/prettier': [
            2,
            { semi: false, singleQuote: true, tabWidth: 4 },
        ],
        'no-undef': 1,
        quotes: [2, 'single'],
        semi: [2, 'never'],
        '@typescript-eslint/no-var-requires': 'off',
        // '@typescript-eslint/typescript-eslint': [2, {'no-var-requires':1}]
    },
}
