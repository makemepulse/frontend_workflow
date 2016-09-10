'use strict'

const when = require('when')

class Task {

  constructor(name, action, options) {
    // Bind
    this.execute              = this.execute.bind(this)
    this.executeTask          = this.executeTask.bind(this)
    this.executePrerequisites = this.executePrerequisites.bind(this)

    // Defaults
    this.name           = name
    this.action         = action
    this.description    = ''
    this.preReqSequence = 'serie'
    Object.assign(this, options || {})

    // Do a test on self dependencies for this task
    if(Array.isArray(this.prerequisites) && this.prerequisites.indexOf(this.name) !== -1) {
      throw new Error("Cannot use prereq " + this.name + " as a dependency of itself");
    }
  }

  execute() {
    if (this.prerequisites) {
      return this.executePrerequisites().then(this.executeTask)
    }
    return this.executeTask()
  }

  executeTask() {
    return when.promise((function(resolve) {
      this.action( resolve )
      if (!this.async) resolve()
    }).bind(this)).then(function(value) {
      return value
    })
  }

  executePrerequisites() {
    if (this.preReqSequence === 'parallel') {
      return wk.TaskManager.parallel(...this.prerequisites)
    }
    return wk.TaskManager.serie(...this.prerequisites)
  }

}

module.exports = Task