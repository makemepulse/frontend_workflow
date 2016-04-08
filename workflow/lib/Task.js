'use strict'

const EventEmitter = require('events').EventEmitter
const guid         = require('./functions/guid').guid
const Bind         = require('./mixins/Bind')
const TaskManager  = require('./TaskManager')
const TaskOptions  = require('./TaskOptions')

/**
 * Create a task object
 * @extend EventEmitter
 * @class Task
 */
class Task extends EventEmitter {

  /**
   *
   * @param {string} name
   * @param {Object} config
   */
  constructor(name, config) {
    super()
    Object.assign(this, Bind)
    this._bindMethods()

    this.options = new TaskOptions(config)
    this._name   = name || 'noname'
    this.guid    = guid()
    this.running = false
  }

  /**
   * Bind methods with the object as context
   * @private
   */
  _bindMethods() {}

  /**
   * Activate listeners
   */
  activate() {}

  /**
   * Desactivate listeners
   */
  desactivate() {}

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

  /**
   * Get the task configuration
   * @returns {Object}
   */
  getConfig() {
    return this.options.getConfig()
  }

  /**
   * Get the task parameters
   * @returns {Object}
   */
  getParameters() {
    return this.options.getParameters()
  }

  /**
   * Execute the task
   */
  execute() {
    if (this.running) return
    this.running = true
    if (typeof this.activate === 'function') this.activate()
    TaskManager.emit('task:execute', this)
  }

  /**
   * Kill the task
   */
  kill() {
    if (!this.running) return
    this.running = false
    if (typeof this.desactivate === 'function') this.desactivate()
    TaskManager.emit('task:kill', this)
  }
}

/**
 * Create a task
 * @returns {Task}
 */
Task.create = function() {
  return new (this)(...arguments)
}

module.exports = Task
