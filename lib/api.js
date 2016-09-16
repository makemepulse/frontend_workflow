'use strict'

/**
 * API implementation from jake.js
 * https://github.com/jakejs/jake/blob/master/lib/api.js
 */

const Task           = require('./task')
const Namespace      = require('./namespace')
const ProcessManager = require('./process-manager')
const TaskManager    = require('./task-manager')

module.exports = {

  /**
   * Register a new task inside the active namespace
   * If the action is a string, it will be executed as a command
   *
   * @param {String} name
   * @param {Array} prerequisites
   * @param {Object} options
   * @param {Function} action
   * @returns {Task} tsk
   */
  task(name, prerequisites, options, action) {

    // Handle arguments
    if (arguments.length === 2) {
      action        = prerequisites
      prerequisites = null
    }

    if (arguments.length === 3) {
      action  = options
      options = null

      if (typeof arguments[1] === 'object' && !Array.isArray(arguments[1])) {
        options       = arguments[1]
        prerequisites = null
      }
    }

    // Handle command callback on exit
    if (typeof action === 'string') {
      const cmd = action

      action = function( complete ) {
        this.ps = ProcessManager.execute(this.name, cmd, this.psOptions)
        if (options && options.async) {
          this.ps.on('exit', function() {
            complete()
          })
        }
      }

    }

    // Create task
    const tsk         = new Task(name, action, options)
    tsk.prerequisites = prerequisites
    tsk.description   = wk.currentDescription

    wk.currentDescription           = null
    wk.currentNamespace.tasks[name] = tsk

    return task

  },

  /**
   * Register a command as a task
   *
   * @param {String} name
   * @param {Array} prerequisites
   * @param {Object} options
   * @param {String} cmd
   * @returns {Task} tsk
   */
  command() {
    return task(...arguments)
  },

  /**
   * Set the current description for the next task initialization
   *
   * @param {String} desc
   */
  desc(desc) {
    wk.currentDescription = desc
  },

  /**
   * Get or create a namespace
   *
   * @param {String} name
   * @param {Function} closure
   */
  namespace(name, closure) {
    const current = wk.currentNamespace
    let ns        = current.children[name]
    if (!ns) ns   = new Namespace(name, current)
    current.children[name] = ns
    wk.currentNamespace = ns
    closure()
    wk.currentNamespace   = current
    wk.currentDescription = null
  },

  /**
   * Run tasks in serie
   *
   * @param {...String} arguments
   * @returns {Promise}
   */
  serie() {
    return TaskManager.serie(...arguments)
  },

  /**
   * Run tasks in parallel
   *
   * @param {...String} arguments
   * @returns {Promise}
   */
  parallel() {
    return TaskManager.parallel(...arguments)
  }

}