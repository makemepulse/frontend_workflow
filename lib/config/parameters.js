'use strict'

module.exports = {

  sequence: {
    type: 'select',
    default: 'serie',
    values: [ 'serie', 'parallel' ],
    aliases: [ 'seq', 's' ]
  },

  verbose: {
    type: 'boolean',
    default: false
  },

  silent: {
    type: 'boolean',
    default: false
  },

  log: {
    type: 'value',
    default: false
  },

  help: {
    type: 'boolean',
    default: false,
    aliases: [ 'h' ]
  },

  kill_pids: {
    type: 'boolean',
    default: false,
    aliases: [ 'kill', 'clean' ]
  },

  ENV: {
    type: 'value',
    default: 'development',
    aliases: [ 'env', 'e' ]
  }

}