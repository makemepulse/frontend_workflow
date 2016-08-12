#!/usr/bin/env node
'use strict';

const TaskProcess = require('../lib/TaskProcess')

class SASS extends TaskProcess {

  execute() {
    const params = this.parameters

    const input  = params.input
    const output = params.output

    var command = ['sass']
    if (params.bourbon) command.push('-r bourbon')

    if (params.sourcemaps) command.push("--sourcemap=inline")
    if (!params.sourcemaps) command.push("--sourcemap=none")
    if (params.watch) command.push("--watch")
    if (params.compress) {
      command.push("--style")
      command.push("compressed")
    }
    if (params.scss) command.push("--scss")
    command.push(input + ':' + output)

    super.execute(command.join(' '))
  }

}

SASS.description = `An extension of CSS that adds power and elegance to the basic language. It allows to use variables, nested rules, mixins, inline imports, and more.
Compile '.sass' and '.scss' file to '.css'`

module.exports = SASS
