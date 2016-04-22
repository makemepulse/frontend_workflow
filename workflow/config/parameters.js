'use strict'

/**
 * Parameters
 * Documentation (https://github.com/substack/subarg)
 */

module.exports = {
  boolean: ['watch', 'compress', 'sourcemap', 'verbose', 'kill_pids', 'help'],
  alias: {
    input: ['i'],
    watch: ['w'],
    output: ['o', 'out'],
    compress: ['m', 'minify', 'min'],
    sourcemap: ['s', 'sourcemaps'],
    verbose: ['v', 'debug'],
    kill_pids: [],
    help: ['h']
  },
  'default': {
    sourcemap: false,
    compress: false,
    watch: false,
    verbose: false,
    kill_pids: false,
    help: false
  }
}
