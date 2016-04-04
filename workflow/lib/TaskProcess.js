'use strict'

const ProcessManager = require('../lib/ProcessManager')
const Task           = require('./Task')

class TaskProcess extends Task {
  constructor() {
    super(...arguments)
    this.ps = null
  }

  activate() {
    this.ps.on('close', this._onExit)
    super.activate()
  }

  desactivate() {
    this.ps.removeListener('close', this._onExit)
    super.desactivate()
  }

  execute(command) {
    if (this.running) return
    this.ps = ProcessManager.executeProcess(this.name, command)
    super.execute()
    return this.ps
  }

  kill() {
    if (!this.running) return
    if (this.ps) ProcessManager.killProcess(this.ps)
    super.kill()
  }
}

module.exports = TaskProcess