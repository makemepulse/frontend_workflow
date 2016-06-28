'use strict'
const path        = require('path')
const Help        = require('./lib/Help')
const Argv        = require('./lib/Argv')
const Print       = require('./lib/Print')
const TaskManager = require('./lib/TaskManager')
let config        = require('./lib/Config')
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
    if (packageJSON.scripts[task_name]) {
      Print.log(`"${task_name}" is not a task, but a task from package.json.`)
    } else {
      Print.log(`"${task_name}" is not a task.`, 'yellow')
    }
    return null
  }

  if (!cfg) {
    Print.log(`Task "${task_name}" is not configured.`, 'yellow')
    Print.log(`Please see workflow/config/tasks.js or your file configuration written in your package.json`, 'yellow')
    return null
  }

  const tasks = []
  for (let t, i = 0, len = cfg.length; i < len ; i++) {
    t = Tasks.createTask(task_name, cfg[i])
    t.options.argv.replace(args)
    // if (!ignoreExecution) t.execute()
    tasks.push(t)
  }

  if (!ignoreExecution) {
    TaskManager.execute(tasks)
  }

  return tasks
}

if (Argv.main.fetch().help) {
  return Help()
}

/**
 * By default, execute a task from parameters
 */
if (execute(process.argv.slice(2))) {
  return
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
const scripts  = packageJSON.scripts
const commands = Argv.main.fetch()._
let tasks      = []

if (commands.length > 0) {

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

  // Sort tasks by no-watchers and watchers
  tmp.sort(function(task) { return task.getParameters().watch })

  // Execute the array of tasks
  TaskManager.execute(tmp)

  return
}
