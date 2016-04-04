#!/usr/bin/env node
'use strict';

const path        = require('path')
const TaskProcess = require('../lib/TaskProcess')

const TSC_CLI = path.join(path.dirname(require.resolve('typescript')), '..', 'bin', 'tsc')

class Typescript extends TaskProcess {

  execute() {
    const params = this.getParameters()

    const input  = params.input
    const output = params.output

    var command = [TSC_CLI, input, '--allowJs']

    if (params.sourcemaps) command.push("--inlineSourceMap")
    if (params.watch) command.push("--watch")
    if (path.extname(output).length === 0) command.push("--outDir "+output)
    else command.push("--out "+output)

    super.execute(command.join(' '))
  }

}

module.exports = Typescript
