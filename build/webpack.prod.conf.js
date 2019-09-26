var path = require('path')
var utils = require('./utils')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

var webpackConfig = merge(baseWebpackConfig, {
  mode:'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: true,
      extract: true
    })
  },
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
    // loadsh: 'loadsh'
  },
  plugins: [
    new VueLoaderPlugin(),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: 'vue-drag-tree.min.css'
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin()
  ]
})

module.exports = webpackConfig
