'use strict'

const Print     = require('./../print')
const ARGParser = require('./../arg-parser')
const pad       = require('./../utils/string').pad
let PARAMS      = {}

// default print
Print.silent()


namespace('wk', function() {

  namespace('startup', function() {

    task('prepare', function( complete ) {
      PARAMS = ARGParser.parse(process.argv.slice(2))
      complete()
    })

    task('load', function( complete ) {
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

    task('execute_tasks', function() {
      const TASKS = PARAMS._._

      if (PARAMS.sequence === 'parallel') {
        parallel( TASKS )
      } else {
        serie( TASKS )
      }
    })

    task('list_tasks', function() {

      let tasks = []

      const getTasks = function(ns) {
        for (const key in ns.tasks) {
          tasks.push( ns.tasks[key] )
        }

        for (const k in ns.children) {
          if (ns.children[k].path === 'wk') continue
          getTasks(ns.children[k])
          tasks.push( '' )
        }
      }

      getTasks(wk.defaultNamespace)

      tasks = tasks.map(function(tsk) {
        if (typeof tsk === 'string') return tsk

        let path          = '   ' + `[${tsk.path}]`
        path              = Print.magenta( pad(path, 25, ' ', true) )

        const description = (tsk.description || '-')

        return path + ' ' + description
      })

      Print.log(Print.grey('Tasks available:\n'))
      Print.log(tasks.join('\n'))

    })

    task('default', [
      'wk:startup:prepare',
      'wk:startup:load'
    ], function() {
      wk.run('wk:startup:configure_print')

      if (PARAMS._._.length) {
        wk.run('wk:startup:execute_tasks')
      }

      if (PARAMS.tasks) {
        wk.run('wk:startup:list_tasks')
      }

    })

  })

})
