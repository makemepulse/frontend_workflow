'use strict';

const when = require('when')

class TaskManager {

  _resolve(names) {
    const tasks = []

    for (let i = 0, len = names.length; i < len; i++) {
      tasks.push( wk.defaultNamespace.resolveTask(names[i]) )
    }

    return tasks

  }

  run(nameOrTask) {
    let t = nameOrTask

    if (typeof t === 'string') {
      t = wk.defaultNamespace.resolveTask(name)
    }

    if (!t) {
      console.log(`Cannot run '${name}' task`)
      return
    }

    const runTask = function() {
      return when.promise(function(resolve) {
        t.action( resolve )
        if (!t.async) resolve()
      }).then(function(value) {
        return value
      })
    }

    if (t.prerequisites) {
      if (t.preReqSequence === 'parallel') {
        return this.parallel(...t.prerequisites).then(runTask)
      }
      return this.serie(...t.prerequisites).then(runTask)
    }

    return runTask()

  }

  serie() {

    const tasks = this._resolve(arguments)

    return when.reduce(tasks, (function(results, t) {
      return this.run(t)
    }).bind(this), [])

  }

  parallel() {

    const tasks = this._resolve(arguments)

    return when.map(tasks, (function(t) {
      return this.run(t)
    }).bind(this))

  }

}

module.exports = new TaskManager