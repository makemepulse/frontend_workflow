'use strict'

const subargOptions = require('./../config/parameters')
const subarg = require('subarg')

class Argv {

  constructor(argv) {
    this._argv = argv || process.argv.slice(2)
  }

  replace(argv) {
    this._argv = argv
  }

  reset() {
    this._argv = process.argv.slice(2)
  }

  fetch() {
    return subarg(this._argv, subargOptions)
  }

}

Argv.main = new Argv

module.exports = Argv