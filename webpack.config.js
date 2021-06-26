/*
 * @Author: Jason
 * @Date: 2021-06-13 20:27:05
 * @Github: https://github.com/JasonLaii
 * @Description:
 * @LastEditTime: 2021-06-13 21:16:06
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')

module.exports = {
  // 环境变量
  mode: process.env.NODE_ENV,
  // 入口
  entry: './main.js',
  // 出口
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  // 配置 loader
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'sass-loader', 'css-loader'],
      },
      {
        test: /\.vue$/i,
        use: 'vue-loader',
      },
    ],
  },
  // 配置plugin
  plugins: [
    new HtmlWebpackPlugin({
      title: 'j-vue-cli',
      template: path.resolve(__dirname, './public/index.html'),
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
  ],
  resolve:{
    // alias: {
    //   vue: "vue/dist/vue.esm-browser.js"
    // }
  }
}