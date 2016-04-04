'use strict'

const EventEmitter   = require('events').EventEmitter
//const ProcessManager = require('./ProcessManager')
const Print          = require('./Print')
const Bind           = require('./mixins/Bind')

class TaskManager extends EventEmitter {
  constructor() {
    super()
    Object.assign(this, Bind)
    this.bindMethods()

    this.tasks = {}

    this.activate()
  }

  bindMethods() {
    this.bind([ '_onTaskExecute', '_onTaskKill', '_onBeforeExit' ])
  }

  activate() {
    process.on('SIGINT', this._onBeforeExit)
    this.on('task:execute', this._onTaskExecute)
    this.on('task:kill', this._onTaskKill)
  }

  desactivate() {
    process.off('SIGINT', this._onBeforeExit)
    this.off('task:execute', this._onTaskExecute)
    this.off('task:kill', this._onTaskKill)
  }

  register(task) {
    if (this.tasks[task.name]) {
      Print.verbose(`'${task.name}' already registered`, true, 'yellow')
      return
    }
    Print.verbose(`'${task.name}' is registered with success`, true, 'green')
    this.tasks[task.name] = task
  }

  unregister(taskOrName) {
    let name
    if (typeof taskOrName === "string") name = taskOrName
    if (typeof taskOrName.name === "string") name = taskOrName.name

    if (!this.tasks[name]) {
      Print.verbose(`'${name}' is not registered`, true, 'yellow')
      return
    }

    Print.verbose(`'${name}' is unregistered with success`, true, 'green')
    delete this.tasks[name]
  }

  _onTaskExecute(task) {
    this.register(task)
  }

  _onTaskKill(task) {
    this.unregister(task)
  }

  _onBeforeExit() {
    if (this._hasTasks()) {
      this._killAll()
      setTimeout(this._onBeforeExit, 500)
      return
    }
    process.exit()
  }

  _hasTasks() {
    let i = 0
    for (let k in this.tasks) {
      i++
    }
    return i !== 0
  }

  _killAll() {
    for (let k in this.tasks) {
      this.tasks[k].kill()
    }
  }
}

module.exports = new TaskManager