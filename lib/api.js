'use strict'

/**
 * API implementation from jake.js
 * https://github.com/jakejs/jake/blob/master/lib/api.js
 */

module.exports = new (function() {

  /**
   *
   *
   */
  this.task = function(name, prerequisites, options, action) {

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

    if (typeof action === 'string') {
      return command(...arguments)
    }

    const t         = new wk.Task(name, action, options)
    t.prerequisites = prerequisites
    t.description   = wk.currentDescription

    wk.currentDescription           = null
    wk.currentNamespace.tasks[name] = t

    return t
  }

  /**
   *
   */
  this.command = function(name, prerequisites, options, cmd) {

    if (arguments.length === 2) {
      cmd           = prerequisites
      prerequisites = null
    }

    if (arguments.length === 3) {
      cmd = options
      options = null

      if (typeof arguments[1] === 'object' && !Array.isArray(arguments[1])) {
        options       = arguments[1]
        prerequisites = null
      }
    }

    const action = function( complete ) {
      const ps = exec(cmd)
      if (options && options.async) {
        ps.on('exit', function() {
          complete()
        })
      }
    }

    const t       = new wk.Task(name, action, options)
    t.description = wk.currentDescription

    wk.currentDescription           = null
    wk.currentNamespace.tasks[name] = t

    return t
  }

  /**
   *
   */
  this.desc = function(description) {
    wk.currentDescription = description
  }

  /**
   *
   */
  this.namespace = function(name, closure) {
    const current = wk.currentNamespace
    const ns      = current.children[name] || new wk.Namespace(name, current)
    current.children[name] = ns
    wk.currentNamespace = ns
    closure()
    wk.currentNamespace   = current
    wk.currentDescription = null
  }

  this.exec = function(cmd) {
    return wk.ProcessManager.execute(wk.guid(), cmd)
  }

  this.run = function(name) {
    return wk.TaskManager.run(name)
  }

  this.serie = function() {
    return wk.TaskManager.serie(...arguments)
  }

  this.parallel = function() {
    return wk.TaskManager.serie(...arguments)
  }

})()