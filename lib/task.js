'use strict'

const when        = require('when')
const guid        = require('./utils/guid').guid
const Print       = require('./print')
const TaskManager = require('./task-manager')

class Task {

  constructor(name, action, options) {
    // Bind
    this.execute              = this.execute.bind(this)
    this.executeTask          = this.executeTask.bind(this)
    this.executePrerequisites = this.executePrerequisites.bind(this)

    // Defaults
    this._name          = name
    this.namespace      = wk.currentNamespace
    this.path           = this.getPath()
    this.guid           = guid()
    this.action         = action.bind(this)
    this.description    = ''
    this.preReqSequence = 'serie'
    Object.assign(this, options || {})

    // Do a test on self dependencies for this task
    if(Array.isArray(this.prerequisites) && this.prerequisites.indexOf(this.name) !== -1) {
      throw new Error("Cannot use prereq " + this.name + " as a dependency of itself");
    }
  }

  /**
   * Get the full name of task
   * @returns {string}
   */
  get fullname() {
    return this._name + '_' + this.guid
  }

  /**
   * Set the name of task
   * @param {string} value
   */
  set name(value) {
    this._name = value
  }

  /**
   * Get the shorten name of task
   * @returns {string}
   */
  get name() {
    return this._name + '_' + this.guid.slice(0, 4)
  }

  getPath() {
    const path = this.namespace.getPath()
    if (path.length === 0) return this._name
    return path + ':' + this._name
  }

  execute() {
    if (this.prerequisites) {
      return this.executePrerequisites().then(this.executeTask)
    }
    return this.executeTask()
  }

  executeTask() {
    Print.verbose('Execute ' + Print.magenta(`[${this.path}]`))
    return when.promise((function(resolve) {
      this.action( resolve )
      if (!this.async) resolve()
    }).bind(this)).then(function(value) {
      return value
    })
  }

  executePrerequisites() {
    Print.debug(Print.grey(`--- Execute prerequisites ---`))
    if (this.preReqSequence === 'parallel') {
      return TaskManager.parallel(...this.prerequisites)
    }
    return TaskManager.serie(...this.prerequisites)
  }

}

module.exports = Task