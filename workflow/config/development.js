'use strict'

const ExtractTextPlugin = require("extract-text-webpack-plugin")

const _config = {
  entry: {
    'main.js': './app/index.js'
  },

  output: {
    filename: "public/[name]",
    chunkFilename: "public/[id].js"
  },

  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'stylus',
          loader: "css-loader!stylus-loader"
        })
      }
    ],

    plugins: [
      new ExtractTextPlugin("public/[name].css")
    ]
  },

  debug: false
}

module.exports = _config