'use strict';

const when = require('when')

class TaskManager {

  _resolve(names) {

    if (names.length === 1 && Array.isArray(names[0])) {
      names = names[0]
    }

    const tasks = []

    for (let i = 0, len = names.length; i < len; i++) {
      tasks.push( wk.defaultNamespace.resolveTask(names[i]) )
    }

    return tasks

  }

  run(nameOrTask) {
    let tsk = nameOrTask

    if (typeof tsk === 'string') {
      tsk = wk.defaultNamespace.resolveTask(nameOrTask)
    }

    if (!tsk) {
      console.log(`Cannot run '${nameOrTask}' task`)
      return
    }

    return tsk.execute()

  }

  serie() {

    const tasks = this._resolve(arguments)

    return when.reduce(tasks, (function(results, tsk) {
      return this.run(tsk)
    }).bind(this), [])

  }

  parallel() {

    const tasks = this._resolve(arguments)

    return when.map(tasks, (function(tsk) {
      return this.run(tsk)
    }).bind(this))

  }

}

module.exports = new TaskManager