'use strict'

const Print     = require('./../print')
const ARGParser = require('./../arg-parser')
let PARAMS      = {}

// default print
Print.silent()

namespace('wk', function() {
  namespace('startup', function() {




    task('prepare', function( complete ) {

      // Get parameters
      PARAMS    = ARGParser.parse(process.argv.slice(2))
      wk.PARAMS = PARAMS

      // Load tasks
      wk.load('./Wkfile')
      wk.load('./package.json')

      complete()
    })




    task('configure_print', function() {

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




    task('default', ['wk:startup:prepare', 'wk:startup:configure_print'], function() {

      if (PARAMS._._.length) {
        wk.run('wk:execute_tasks')
      } else if (PARAMS.tasks) {
        wk.run('wk:list_tasks')
      } else if (PARAMS.clean) {
        wk.run('wk:clean')
      } else if (PARAMS.help) {
        wk.run('wk:help')
      } else {
        wk.run('wk:help')
      }

    })




  })
})
