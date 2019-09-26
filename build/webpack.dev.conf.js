var path = require('path')
var utils = require('./utils')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')

var webpackConfig = merge(baseWebpackConfig, {
  mode:'development',
  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      extract: true
    })
  },
  devtool:'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
    filename: 'vue-drag-tree.min.js',
    library: 'VueDragTree',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    },
    loadsh: 'loadsh'
  },
})

module.exports = webpackConfig
