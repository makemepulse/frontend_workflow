#!/usr/bin/env node
'use strict';

const path        = require('path')
const fs          = require('fs-extra')
const paths       = require('../config/paths')
const TaskProcess = require('../lib/TaskProcess')

const UGLIFY_CLI = path.join(path.dirname(require.resolve('uglifyjs')), '..', 'bin', 'uglifyjs')

class Uglify extends TaskProcess {

  execute() {
    const params = this.getParameters()

    let input     = params.input
    const output  = params.output
    let tmp_input = null

    if (input === output) {
      const extname = path.extname(input)
      tmp_input = `${paths.tmp_path}/${path.basename(input).replace(extname, '')}_uglify${extname}`
      fs.copySync(input, tmp_input)
      input = tmp_input
    }

    const command = [UGLIFY_CLI]
    command.push(input)
    command.push('-c')
    command.push('--mangle')
    command.push("--output")
    command.push(output)

    const ps = super.execute(command.join(' '))
    ps.on('close', function() {
      if (tmp_input) fs.unlinkSync(tmp_input)
    })
  }

}

Uglify.description = `Minify JS file`

module.exports = Uglify
