const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const { VueLoaderPlugin } = require('vue-loader')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
    target: 'node',
    // 环境变量
    mode: process.env.NODE_ENV,
    // 入口
    entry: './bin/cli.ts',
    // 出口
    output: {
        path: path.resolve(__dirname, './bundle'),
        filename: '[name].bundle.js',
    },
    devtool: 'source-map',
    // 配置 loader
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: ['ts-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.js?$/i,
                use: ['source-map-loader'],
            },
            // {
            //     test: /\.css$/i,
            //     use: ['style-loader', 'css-loader'],
            // },
            // {
            //     test: /\.s[ac]ss$/i,
            //     use: ['style-loader', 'sass-loader', 'css-loader'],
            // },
            // {
            //     test: /\.vue$/i,
            //     use: 'vue-loader',
            // },
        ],
    },
    // 配置plugin
    plugins: [
        new NodePolyfillPlugin(),
        // new HtmlWebpackPlugin({
        //     title: 'j-vue-cli',
        //     template: path.resolve(__dirname, './public/index.html'),
        // }),
        // new CleanWebpackPlugin(),
        // new VueLoaderPlugin(),
    ],
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        fallback: {
            fs: false,
            child_process: false,
            readline: false,
            net: false,
            tls: false,
        },
        // alias: {
        //   vue: "vue/dist/vue.esm-browser.js"
        // }
    },
}
