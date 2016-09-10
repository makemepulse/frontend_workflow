'use strict'

/**
 * Namespace implementation from jake.js
 * https://github.com/jakejs/jake/blob/master/lib/namespace.js
 */

class Namespace {

  constructor(name, parent) {
    this.name     = name
    this.parent   = parent
    this.children = {}
    this.tasks    = {}
    this.path     = this.getPath()
  }

  resolveTask(path) {
    const parts = path.split(':')
    const name  = parts.pop()
    const ns    = this.resolveNamespace(parts.join(':'))

    return (ns && ns.tasks[name]) || (this.parent && this.parent.resolve(path))
  }

  resolveNamespace(path) {
    if (!path) {
      return this
    }

    const parts = path.split(':')
    let ns      = this

    for (let i = 0, len = parts.length; ns && i < len; i++) {
      ns = ns.children[parts[i]]
    }

    return ns || (this.parent && this.parent.resolveNamespace(path))
  }

  getPath() {
    const path  = [ this.name ]
    let next    = true
    let current = this

    while(next) {
      if (current.parent) {
        path.push(current.parent.name)
        current = current.parent
        continue
      }
      next = false
    }

    // Remove default namespace from path
    path.pop()

    return path.reverse().join(':')
  }

}

module.exports = Namespace