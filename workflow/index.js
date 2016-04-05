'use strict'
const path        = require('path')
const Argv        = require('./lib/Argv')
const Print       = require('./lib/Print')
const TaskManager = require('./lib/TaskManager')
let config        = require('./config/tasks')
const Tasks       = require('./tasks')
const packageJSON = require('../package.json')

/**
 * Create and execute a task from parameters
 *
 * @param args {array} - List of parameters
 * @param ignoreExecution - To ignore the task execution
 * @returns {*}
 */
const execute = function(args, ignoreExecution) {
  ignoreExecution = ignoreExecution || false

  const argv      = new Argv(args)
  const task_name = argv.fetch()._[0]
  const cfg       = config[task_name]

  if (!Tasks.isTask(task_name)) {
    Print.log(`'${task_name}' is not a task.`, true, 'yellow')
    return null
  }

  if (!cfg) {
    Print.log(`'${task_name}' is not configured.`, true, 'yellow')
    return null
  }

  const tasks = []
  const task  = Tasks.getTask(task_name)
  for (let t, i = 0, len = cfg.length; i < len ; i++) {
    t = task.create(task_name, cfg[i])
    t.options.argv.replace(args)
    if (!ignoreExecution) t.execute()
    tasks.push(t)
  }

  return tasks
}

/**
 * Use config file written inside package.json
 *
 * Inside package.json, you can precise a different config file per environment
 * eg.:
 *
 *    "workflow": {
 *      "production": "./workflow/production.js"
 *      "development": "./workflow/development.js"
 *    }
 *
 * To precise an environment :
 *
 *    "workflow": {
 *      "env": "production"
 *    }
 *
 *    OR
 *
 *    NODE_ENV=production node workflow browserify
 *
 * The environment by default is `development`
 *
 */
if (packageJSON.workflow) {
  const w   = packageJSON.workflow
  const ENV = w['env'] || process.env.NODE_ENV || 'development'

  if (w[ENV])           config = require(path.resolve(w[ENV]))
  else if (w['config']) config = require(path.resolve(w['config']))
}

/**
 * Detect npm context
 * If multiple tasks are detected, execute each task
 *
 * Inside package.json, you can replace the task name by a npm task name
 * eg.:
 *
 *    "scripts": {
 *      "browserify:compile": "node workflow browserify",
 *      "stylus:compile": "node workflow stylus",
 *      "compile": "node workflow stylus:compile browserify:compile"
 *    }
 *
 * By default, each task is executed one by one. If you want to execute your task
 * before the end of the previous, override the watcher parameter to `true` inside `tasks.js`.
 * eg.:
 *
 *    _tasks['watcher'] = [
 *      {
 *        file: './public/**',
 *        override_parameters: {
 *          watch: true
 *        }
 *      }
 *    ]
 *
 * Or add the watch option
 *
 *    node workflow watcher -w
 *
 */
const isNPM = !!(process.env.npm_package_name)

if (isNPM) {
  const scripts  = packageJSON.scripts
  const commands = Argv.main.fetch()._
  let tasks      = []

  if (commands.length > 1) {
    for (let len = commands.length, i = 0; i < len; i++) {
      if (scripts.hasOwnProperty(commands[i])) {
       tasks = Array.prototype.concat(tasks, execute(scripts[commands[i]].split(' ').slice(2), true))
      }
    }

    // Clean array
    let tmp = []
    for (let ln = tasks.length, j = 0; j < ln; j++) {
      if (tasks[j]) tmp.push(tasks[j])
    }

    // Execute the array of tasks
    TaskManager.execute(tmp)

    return
  }

}

/**
 * By default, execute a task from parameters
 */
execute(process.argv.slice(2))