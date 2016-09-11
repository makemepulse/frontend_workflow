'use strict'

const Print     = require('./../print')
const ARGParser = require('./../arg-parser')
let PARAMS      = {}

// default print
Print.silent()

namespace('__startup', function() {

  task('prepare', function( complete ) {
    PARAMS = ARGParser.parse(process.argv.slice(2))
    complete()
  })

  task('load', function( complete ) {
    wk.load('./Wkfile')
    wk.load('./package.json')
    complete()
  })

  task('configre_print', function() {

    Print.defaults()

    // --log=verbose,warn,error
    if (PARAMS.log) {
      Print.silent()
      const levels = PARAMS._.log.split(/,/)
      if (levels.length) {
        for (const level in levels) {
          Print.visibility(levels[level], true)
        }
      }
    } else {
      // --silent
      if (PARAMS.silent) Print.silent()

      // --verbose
      Print.visibility('verbose', PARAMS.verbose)
    }

  })

  task('default', [
    '__startup:prepare',
    '__startup:load'
  ], function() {
    wk.run('__startup:configre_print')

    const TASKS = PARAMS._._

    if (TASKS.length) {
      if (PARAMS.sequence === 'parallel') {
        parallel( TASKS )
      } else {
        serie( TASKS )
      }
    }

  })

})