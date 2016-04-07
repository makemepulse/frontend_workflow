'use strict'

/**
 * Parameters
 * Documentation (https://github.com/substack/subarg)
 */

module.exports = {
  boolean: ['watch', 'compress', 'sourcemap', 'verbose'],
  alias: {
    input: ['i'],
    watch: ['w'],
    output: ['o', 'out'],
    compress: ['m', 'minify', 'min'],
    sourcemap: ['s', 'sourcemaps'],
    verbose: ['v', 'debug']
  },
  'default': {
    sourcemap: false,
    compress: false,
    watch: false,
    verbose: true
  }
}
