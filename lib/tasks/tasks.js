'use strict'

const pad   = require('./../utils/string').pad

namespace('wk', function() {




  desc('Execute task from parameters')
  task('execute_tasks', function() {
    const TASKS = wk.PARAMS._._

    if (wk.PARAMS.sequence === 'parallel') {
      parallel( TASKS )
    } else {
      serie( TASKS )
    }
  })




  desc('List available tasks')
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

      let path          = '   ' + `${tsk.path}`
      path              = pad(path, 25, ' ', true)

      const description = (tsk.description || '-')

      return path + ' ' + description
    })

    console.log('Tasks available:\n')
    console.log(tasks.join('\n'))

  })




})