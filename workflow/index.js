'use strict'
const path        = require('path')
const Argv        = require('./lib/Argv')
const Print       = require('./lib/Print')
const TaskManager = require('./lib/TaskManager')
let config        = require('./config')
const Tasks       = require('./tasks')
const packageJSON = require('../package.json')

/**
 * Execute a task
 */
const execute = function(ignoreExecution) {
  ignoreExecution = ignoreExecution || false

  const task_name = Argv.fetch()._[0]
  const cfg       = config[task_name]

  if (!Tasks.isTask(task_name)) {
    Print.log(`'${task_name}' is not a task.`, true, 'yellow')
  }

  if (!cfg) {
    Print.log(`'${task_name}' is not configured. Please setup "config.js".`, true, 'yellow')
    return
  }

  const tasks = []
  const task  = Tasks.getTask(task_name)
  for (let t, i = 0, len = cfg.length; i < len ; i++) {
    t = task.create(task_name, cfg[i])
    if (!ignoreExecution) t.execute()
    tasks.push(t)
  }

  return tasks
}

/**
 * Use config file precised inside package.json
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
 */
const isNPM = !!(process.env.npm_package_name)

if (isNPM) {
  const scripts  = packageJSON.scripts
  const commands = Argv.fetch()._
  let tasks      = []

  if (commands.length > 1) {
    for (let len = commands.length, i = 0; i < len; i++) {
      if (scripts.hasOwnProperty(commands[i])) {
        Argv.replace(scripts[commands[i]].split(' ').slice(2))
        tasks = Array.prototype.concat(tasks, execute(true))
      }
    }

    TaskManager.execute(tasks)

    return
  }

}

execute()