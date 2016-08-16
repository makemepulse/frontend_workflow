'use strict'

const EventEmitter = require('events').EventEmitter
const Print        = require('./Print')
const Bind         = require('./mixins/Bind')

class TaskManager extends EventEmitter {
  constructor() {
    super()
    Bind.assign(this, [ '_onTaskExecute', '_onTaskKill', '_onBeforeExit' ])

    this.tasks = {}

    this.activate()
  }

  activate() {
//    process.on('beforeExit', this._onBeforeExit)
    process.on('SIGINT', this._onBeforeExit)
    this.on('task:execute', this._onTaskExecute)
    this.on('task:kill', this._onTaskKill)
  }

  desactivate() {
//    process.off('beforeExit', this._onBeforeExit)
    process.off('SIGINT', this._onBeforeExit)
    this.off('task:execute', this._onTaskExecute)
    this.off('task:kill', this._onTaskKill)
  }

  register(task) {
    if (this.tasks[task.name]) {
      Print.verbose(`[${task.name}] already registered`, 'yellow')
      return
    }
    Print.verbose(`[${task.name}] is registered with success`, 'green')
    this.tasks[task.name] = task
  }

  unregister(taskOrName) {
    let name
    if (typeof taskOrName === "string") name = taskOrName
    if (typeof taskOrName.name === "string") name = taskOrName.name

    if (!this.tasks[name]) {
      Print.verbose(`'${name}' is not registered`, 'yellow')
      return
    }

    Print.verbose(`'${name}' is unregistered with success`, 'green')
    delete this.tasks[name]
  }

  _onTaskExecute(task) {
    // this.register(task)
    Print.verbose(`'${task.name}' is executed with success`, 'green')
  }

  _onTaskKill(task) {
    // this.unregister(task)
    Print.verbose(`'${task.name}' is killed with success`, 'green')
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
    return Object.keys(this.tasks).length !== 0
  }

  _killAll() {
    for (const k in this.tasks) {
      if (this.tasks.running) {
        this.tasks[k].kill()
      }
    }
  }

  execute(taskOrTasks) {
    // Detect if it's an array
    if (typeof taskOrTasks.length === 'undefined') {
      taskOrTasks.execute()
      return
    }

    // Execute the array of tasks, one by one
    const tasks      = taskOrTasks
    let current_task = null
    const len        = tasks.length
    let index        = 0

    // Sort tasks by no-watchers and watchers
    tasks.sort(function(task) { return task.parameters.watch })

    const _onNext = (function() {
      if (current_task) {
        this.removeListener('task:kill', _onNext)
      }

      if (tasks.length > 0) {
        index++
        current_task = tasks.shift()
        if (current_task) {
          this.on('task:kill', _onNext)

          const isWatching = current_task.parameters.watch
          let msg = `Execute task [${current_task.name}] (${index}/${len})`

          if (isWatching) {
            msg += '. Watching...'
          }

          Print.log(msg, 'white')

          try {
            current_task.execute()
            if (isWatching) {
              setTimeout(_onNext, 1000) // Execute the next task if the current is a watcher
            }
          } catch(e) {
            Print.log(e, 'red')
          }
        } else {
          _onNext()
        }
      }
    }).bind(this)

    _onNext()
  }

}

module.exports = new TaskManager
