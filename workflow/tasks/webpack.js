'use strict'

const TaskProcess = require('../lib/TaskProcess')

class Webpack extends TaskProcess {
  execute() {
    const parameters = this.parameters
    const cmd        = ['webpack', '--config', parameters.configPath]
    if (parameters.watch) cmd.push('--watch')
    super.execute(cmd.join(' '))
  }
}

module.exports = Webpack