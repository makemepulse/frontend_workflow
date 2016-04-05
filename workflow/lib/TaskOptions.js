#!/usr/bin/env node
'use strict'

const Argv = require('./Argv')
const _exports = [
  'input',
  'output',
  'watch',
  'sourcemaps',
  'compress',
  'config_path'
]

class TaskOptions {

  constructor(config) {
    this._config = config
    this.argv    = new Argv
  }

  getParameters() {
    const argv   = this.argv.fetch()
    const result = {argv:argv}

    for (let len = _exports.length, i = 0; i < len; i++) {
      result[_exports[i]] = argv[_exports[i]]
    }

    const override = this._config.override_parameters || {}

    if (this._config.file) {
      const input_output = this._config.file.split(' ')
      override.input     = input_output[0]
      override.output    = input_output[1]
    }

    for (let len = _exports.length, i = 0; i < len; i++) {
      if (result.hasOwnProperty(_exports[i]) && override.hasOwnProperty(_exports[i])) {
        result[_exports[i]] = override[_exports[i]]
      }
    }

    return result
  }

  getConfig() {
    return this._config
  }

}

module.exports = TaskOptions
