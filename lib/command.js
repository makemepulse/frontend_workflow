'use strict'

const pad            = require('./utils/string').pad
const Print          = require('./Print')
const ARGParser      = require('./arg-parser')
const parameters     = require('./config/parameters')
const ProcessManager = require('./process-manager')
const pkg            = require('./../package.json')


const listTasks = function() {

  let tasks = []

  const getTasks = function(ns) {
    if (ns.path.length === 0) tasks.push(`[default]`)
    else tasks.push( `\n[${ns.path}]` )

    for (const key in ns.tasks) {
      tasks.push( ns.tasks[key] )
    }

    for (const k in ns.children) {
      // if (ns.children[k].path === 'wk') continue
      getTasks(ns.children[k])
    }
  }

  getTasks(wk.defaultNamespace)

  let length = 0
  for (const i in tasks) {
    if (typeof tasks[i] === 'string') continue
    if (length < tasks[i].path.length) length = tasks[i].path.length
  }

  tasks = tasks.map(function(tsk) {
    if (typeof tsk === 'string') return tsk
    if (!tsk.description) return 'wk ' + `${Print.green(tsk.path)}`

    const path = pad(tsk.path, length + 5, ' ', true)
    return 'wk ' + Print.green(path) + ' ' + Print.grey('# ' + tsk.description)
  })

  console.log(tasks.join('\n'))

}


const help = function() {
  const p = []
  let str = null, param = null
  for (const key in parameters) {

    param = parameters[key]
    str = ''

    if (!param.aliases) {
      param.aliases = [ key ]
    } else {
      param.aliases.unshift( key )
    }

    for (const i in param.aliases) {
      if (param.aliases[i].length === 1) {
        str += ' -' + param.aliases[i]
      } else {
        str += ' --' + param.aliases[i]
      }
    }

    if (param.type === 'select') {
      const s = param.values.join('|')
      str += ` (${s})`
    } else if (param.type === 'value') {
      str += ` <string>`
    }

    str = '  ' + pad(str, 40, ' ', true)
    str = str + ' ' + (param.description || '-') + ''

    p.push( str )
  }

  console.log( `${pkg.name} v${pkg.version} \n`)
  console.log( p.join('\n')  )
}

module.exports = function() {

  const PARAMS = ARGParser.parse(process.argv.slice(2))

  // --help -h
  if (PARAMS.help) {
    help()
    return
  }

  // -T --tasks
  if (PARAMS.tasks) {
    listTasks()
    return
  }

  // --clean --kill
  if (PARAMS.clean) {
    ProcessManager.clean()
  }

  // --log=<levels>
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

  if (PARAMS._._.length > 0) {

    // --parallel -p
    if (PARAMS.parallel) {
      parallel( PARAMS._._ )
      return
    }

    // --sequence --seq -s=(parallel|serie)
    if (PARAMS.sequence === 'parallel') {
      parallel( PARAMS._._ )
    } else {
      serie( PARAMS._._ )
    }

    return
  }

  help()

}