'use strict'

module.exports = {

  sequence: {
    type: 'select',
    default: 'serie',
    values: [ 'serie', 'parallel' ],
    aliases: [ 'seq', 's' ],
    description: 'Execute task in "serie" or "parallel"'
  },

  verbose: {
    type: 'boolean',
    default: false,
    description: "Display verbose log"
  },

  silent: {
    type: 'boolean',
    default: false,
    description: "Hide logs"
  },

  log: {
    type: 'value',
    default: false,
    description: "Precise log levels (eg.: --log=log,warn,error)"
  },

  help: {
    type: 'boolean',
    default: false,
    aliases: [ 'h' ],
    description: 'Help?'
  },

  clean: {
    type: 'boolean',
    default: false,
    aliases: [ 'kill' ],
    description: 'Kill all processes referenced inside tmp/pids'
  },

  tasks: {
    type: 'boolean',
    default: false,
    aliases: [ 'T' ],
    description: 'List available tasks'
  }

}