'use strict'

const Task        = require('./tasks')
const TaskManager = require('./lib/TaskManager')
const Print       = require('./lib/Print')
const Config      = require('./lib/Config')
const _           = require('./lib/functions/object')
const packageJSON = require('../package.json')

const parameters = process.argv.slice(2)
const ARGParser  = require('./lib/ARGParser')
ARGParser.config = require('./config/parameters')

const PARAMS = ARGParser.parse( parameters )
const TASKS    = []

const add_task = function( params ) {
  if (!Task.isTask( params.task )) {
    Print.log(`"${params.task}" is not a task.`, 'yellow')
    return
  }

  TASKS.push( Task.createTask(params.task, params) )
}

const add_tasks = function( params ) {
  const tasks = Config[params.task]

  if (!tasks || tasks.length === 0) {
    Print.log(`"${params.task}" has no task.`, 'yellow')
    return
  }

  for (let i = 0, len = tasks.length; i < len; i++) {
    add_task( _.extend(params, tasks[i]) )
  }
}

if (!PARAMS.input && !PARAMS.file && PARAMS.task) {



}

// Execute the command
if (PARAMS.input || PARAMS.file)
{
  add_task( PARAMS )
}

// Execute a group of tasks
else if (PARAMS.task && Task.isTask( PARAMS.task ) && Config.hasOwnProperty( PARAMS.task ))
{
  add_tasks( PARAMS )
}

// Execute NPM tasks
else {

  const CMD     = PARAMS._
  const scripts = packageJSON.scripts
  let params

  for (let len = CMD.length, i = 0; i < len; i++) {
    if (scripts.hasOwnProperty(CMD[i])) {
      params = ARGParser.parse( scripts[CMD[i]].split(' ').slice(2) )
      add_tasks( params )
      params = null
    }
  }

}

if (TASKS.length === 0) {
  Print.log(`No task found`, 'yellow')
  return
}

TaskManager.execute(TASKS)