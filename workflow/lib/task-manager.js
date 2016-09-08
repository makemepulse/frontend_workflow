'use strict';

const guid           = require('./utils/guid').guid
const _TASKS         = {}
const ProcessManager = require('./process-manager')
const when           = require('when')

class TaskManager {

  get tasks() {
    return _TASKS
  }

  resolve(tasks) {
    if (tasks.length === 1 && Array.isArray(tasks[0])) {
      tasks = tasks[0]
    }

    for (let i = 0, len = tasks.length; i < len; i++) {
      tasks[i] = _TASKS[tasks[i]]
    }

    return tasks
  }

  serie() {

    const tasks = this.resolve(arguments)

    return when.reduce(tasks, function(results, task) {
      return when.promise(function(resolve) {
        task(resolve)
      }).then(function(value) {
        results.push( value )
        return results
      })
    }, [])

  }

  parallel() {

    const tasks = this.resolve(arguments)

    return when.map(tasks, function(task) {
      return task(function( value ) {
        return value
      })
    })

  }

  register(name, commandOrFunction) {
    if (_TASKS.hasOwnProperty(name)) {
      console.warn(`Task '${name}' already registered.`)
      return
    }

    if (typeof commandOrFunction === 'string') {
      this.registerCommand(name, commandOrFunction)
      return
    }

    _TASKS[name] = commandOrFunction
  }

  registerCommand(name, command) {
    if (arguments.length === 1) {
      command = name
      name    = guid()
    }

    _TASKS[name] = function(complete) {
      const ps = ProcessManager.execute(name, command)
      ps.on('exit', function() {
        complete()
      })
    }

    return name
  }

}

module.exports = new TaskManager