'use strict'

const subargOptions = require('./../config/parameters')
const subarg = require('subarg')

/**
 * Create an Argv object.
 * It is an object that keep your list or arguments
 * and parse them with subarg and subargOptions defined in config/parameters.js
 * @class Argv
 */
class Argv {

  /**
   * @param {Array} [argv]
   */
  constructor(argv) {
    this._argv = argv || process.argv.slice(2)
  }

  /**
   * Replace the list of arguments
   * @param {Array} argv
   */
  replace(argv) {
    this._argv = argv
  }

  /**
   * Reset the list of arguments by the list from the process
   */
  reset() {
    this._argv = process.argv.slice(2)
  }

  /**
   * Parse arguments with subargOptions defined in config/parameters.js
   * It will return an parsed object
   * @returns {Object}
   */
  fetch() {
    return subarg(this._argv, subargOptions)
  }

}

/**
 * The main Argv object with the process arguments
 * @type {Argv}
 */
Argv.main = new Argv

module.exports = Argv
