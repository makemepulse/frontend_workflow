'use strict'

const EventEmitter = require('events').EventEmitter
const guid         = require('./functions/guid').guid
const Bind         = require('./mixins/Bind')
const TaskManager  = require('./TaskManager')
const TaskOptions  = require('./TaskOptions')

class Task extends EventEmitter {
  constructor(name, config) {
    super()
    Object.assign(this, Bind)
    this.bindMethods()

    this.options = new TaskOptions(config)
    this._name   = name || 'noname'
    this.guid    = guid()
    this.running = false
  }

  bindMethods() {
    this.bind([ '_onExit' ])
  }

  activate() {
    process.on('beforeExit', this._onExit)
  }

  desactivate() {
    process.removeListener('beforeExit', this._onExit)
  }

  get fullname() {
    return this._name + '_' + this.guid
  }

  set name(value) {
    this._name = value
  }

  get name() {
    return this._name + '_' + this.guid.slice(0, 4)
  }

  getConfig() {
    return this.options.getConfig()
  }

  getParameters() {
    return this.options.getParameters()
  }

  execute() {
    if (this.running) return
    this.running = true
    if (typeof this.activate === 'function') this.activate()
    TaskManager.emit('task:execute', this)
  }

  kill() {
    if (!this.running) return
    this.running = false
    if (typeof this.desactivate === 'function') this.desactivate()
    TaskManager.emit('task:kill', this)
  }

  _onExit() {
    this.kill()
  }
}

Task.create = function() {
  return new (this)(...arguments)
}

module.exports = Task