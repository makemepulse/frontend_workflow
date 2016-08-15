'use strict'

const EventEmitter = require('events').EventEmitter
const guid         = require('./functions/guid').guid
const Bind         = require('./mixins/Bind')
const TaskManager  = require('./TaskManager')
const _            = require('./functions/object')

/**
 * Create a task object
 * @extend EventEmitter
 * @class Task
 */
class Task extends EventEmitter {

  /**
   *
   * @param {string} name
   * @param {Object} parameters
   */
  constructor(name, parameters) {
    super()
    Bind.assign(this, [ '_onExit' ])

    this.parameters = _.clone(parameters)
    this._name      = name || 'noname'
    this.guid       = guid()
    this.running    = false
    this._setup()
  }

  /**
   * Activate listeners
   */
  activate() {
    process.on('beforeExit', this._onExit)
  }

  /**
   * Desactivate listeners
   */
  desactivate() {
    process.on('beforeExit', this._onExit)
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

  // /**
  //  * Get the task configuration
  //  * @returns {Object}
  //  */
  // getConfig() {
  //   return this.options.getConfig()
  // }

  // /**
  //  * Get the task parameters
  //  * @returns {Object}
  //  */
  // getParameters() {
  //   return this.options.getParameters()
  // }

  /**
   * Execute the task
   */
  execute() {
    if (this.running) return
    this.running = true
    if (typeof this.activate === 'function') this.activate()

    this.emit('execute')
    TaskManager.emit('task:execute', this)
  }

  /**
   * Kill the task
   */
  kill() {
    if (!this.running) return
    this.running = false
    if (typeof this.desactivate === 'function') this.desactivate()

    this.emit('kill')
    TaskManager.emit('task:kill', this)
  }

  _setup() {
    if (this.parameters.file) {
      const input_output     = this.parameters.file.split(' ')
      this.parameters.input  = input_output[0]
      this.parameters.output = input_output[1]
    }
  }

  /**
   * It is difficult to detect when a task is finished or not.
   * So I listen the main process event 'beforeExit', to detect that.
   * Call the kill method to dispatch 'kill' event and desactivate listeners
   * @private
   */
  _onExit() {
    this.kill()
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
