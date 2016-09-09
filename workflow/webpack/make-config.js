'use strict'

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const path              = require('path')
const webpack           = require('webpack')

module.exports = function(options) {

  const srcPath = './app'
  const dstPath = './public'

  const ExtractStylus = new ExtractTextPlugin("[name]")

  const _config = {
    context: path.resolve(`${__dirname}/../..`),

    output: {
      filename: "[name]",
      chunkFilename: "[id]"
    },

    resolve: {
      root: srcPath,
      extensions: ['', '.js', '.ts']
    },

    module: {
      loaders: [
        {
          test: /\.(svg|html)/,
          exclude: /(node_modules|bower_components|vendor)/,
          loader: 'raw'
        },
        {
          test: /\.styl$/,
          exclude: /(node_modules|bower_components|vendor)/,
          loader: options.compress ?
            ExtractStylus.extract(['css?minimize', 'stylus']) :
            ExtractStylus.extract(['css', 'stylus'])
        },
        {
          test: /\.ts$/,
          exclude: /(node_modules|bower_components|vendor)/,
          loader: 'ts-loader'
        }
      ]
    },

    plugins: [],

    ts: {
      configFileName: './workflow/typescript/tsconfig.json'
    }
  }

  /**
   * Outputs / Inputs
   */
  _config.entry = {}
  _config.entry[`${dstPath}/main.js`]   = `${srcPath}/index.ts`
  _config.entry[`${dstPath}/vendor.js`] = `${srcPath}/vendor/index.js`
  _config.entry[`${dstPath}/main.css`]  = `${srcPath}/index.styl`

  /**
   * Watch
   */
  if (options.watch) {
    _config['watch'] = true
  }

  /**
   * Sourcemaps
   */
  if (options.sourcemap) {
    _config['devtool'] = 'inline-source-map'
  }

  /**
   * Plugins: Extract stylus output file
   */
    _config.plugins.push( ExtractStylus )

    /**
     * Plugin: Uglify
     */
    if (options.compress) {
      _config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false
          }
        })
      )
    }

  return _config

}