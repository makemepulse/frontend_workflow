#!/usr/bin/env node
'use strict';

const path        = require('path')
const TaskProcess = require('../lib/TaskProcess')

const POSTCSS_CLI       = path.join(path.dirname(require.resolve('postcss-cli')), 'bin', 'postcss')
const AUTOPREFIXER_PATH = path.join(path.dirname(require.resolve('autoprefixer')), '..')

class PostCSS extends TaskProcess {

  execute() {
    const params = this.getParameters()

    const input  = params.input
    const output = params.output

    var command = [POSTCSS_CLI]
    if (params.sourcemaps) command.push("--map")
    if (params.watch) command.push("--watch")

    command.push(`--use ${AUTOPREFIXER_PATH}`)
    command.push(`--output ${output}`)
    command.push(input)

    super.execute(command.join(' '))
  }

}

module.exports = PostCSS
