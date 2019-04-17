var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var webpackConfig = merge(baseWebpackConfig, {
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
    loadsh: 'loadsh'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {     //压缩代码
          dead_code: true,    //移除没被引用的代码
          warnings: false,     //当删除没有用处的代码时，显示警告
          loops: true //当do、while 、 for循环的判断条件可以确定是，对其进行优化
      },
      sourceMap: true,
      except: ['$super', '$', 'exports', 'require']    //混淆,并排除关键字
    }),
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
