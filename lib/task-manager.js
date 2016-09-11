'use strict';

const when  = require('when')
const Print = require('./print')

class TaskManager {

  run(nameOrTask) {
    let tsk = nameOrTask

    if (typeof tsk === 'string') {
      tsk = wk.defaultNamespace.resolveTask(nameOrTask)
    }

    if (!tsk) {
      Print.error(`Cannot run '${nameOrTask}' task`)
      return
    }

    return tsk.execute()

  }

  serie() {

    const tasks = this._resolve(arguments)

    if (tasks.length === 0) {
      Print.error('No task found')
      return when(false)
    }

    this._verbose(tasks, 'serie')

    return when.reduce(tasks, (function(results, tsk) {
      return this.run(tsk)
    }).bind(this), [])

  }

  parallel() {

    const tasks = this._resolve(arguments)

    if (tasks.length === 0) {
      Print.error('No task found')
      return when(false)
    }

    this._verbose(tasks, 'parallel')

    return when.map(tasks, (function(tsk) {
      return this.run(tsk)
    }).bind(this))

  }

  _resolve(names) {

    if (names.length === 1 && Array.isArray(names[0])) {
      names = names[0]
    }

    const tasks = []

    for (let i = 0, res = null, len = names.length; i < len; i++) {
      res = wk.defaultNamespace.resolveTask(names[i])
      if (res) tasks.push( res )
    }

    return tasks

  }

  _verbose(tasks, sequence) {

    const names = tasks.map(function(tsk) {
      return Print.magenta(`[${tsk.path}]`)
    })

    Print.debug(`Execute tasks ${names.join(' ')} ` + Print.green(`(${sequence})`) )

  }

}

module.exports = new TaskManager