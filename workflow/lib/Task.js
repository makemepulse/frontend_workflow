'use strict'

class Task {

  constructor(name, action, options) {
    this.name           = name
    this.action         = action
    this.description    = ''
    this.preReqSequence = 'serie'
    Object.assign(this, options || {})
  }

}

module.exports = Task