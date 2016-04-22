'use strict'

const ProcessManager = require('../lib/ProcessManager')
const Task           = require('./Task')

class TaskProcess extends Task {
  constructor() {
    super(...arguments)
    this.ps = null
  }

  /**
   * Activate listeners
   */
  activate() {
    this.ps.on('close', this._onExit)
  }

  /**
   * Desactivate listeners
   */
  desactivate() {
    this.ps.removeListener('close', this._onExit)
  }

  /**
   * Execute command to a child process
   * @param {string} command
   * @returns {null|ChildProcess}
   */
  execute(command) {
    if (this.running) return null
    this.ps = ProcessManager.executeProcess(this.name, command)
    super.execute()
    return this.ps
  }

  /**
   * Kill the child process
   */
  kill() {
    if (!this.running) return null
    if (this.ps) ProcessManager.killProcess(this.ps)
  }

  /**
   * When the process is killed
   * Call the super.kill method to dispatch 'kill' event and desactivate listeners
   * @private
   */
  _onExit() {
    super._onExit()
    super.kill()
  }
}

module.exports = TaskProcess
