'use strict'

const Print = require('./Print')
const Argv  = require('./Argv')
const Tasks = require('../tasks')

const TaskDescription = function(task_name, task) {
  let header = `\n== ${task_name.toUpperCase()} ==\n`
  if (task.description) {
    Print.log(`${header}${task.description}`, 'yellow')
    return
  }
  Print.log(`${header}No description found`, 'yellow')
  return
}

const Documentation = function() {

console.log(`== Frontend Workflow ==

Available tasks : \n  - ${Tasks.tasks.join('\n  - ')}

Can be executed with:
  node workflow stylus

Display task description:
  node workflow stylus --help

Options:
  -i, --input             Input files
  -o, --output            Output files

  -w, --watch             Add watch files
  -s, --sourcemaps        Add sourcemaps
  -m, --min, --compress   Minify file

  -v, --debug, --verbose  Display extra informations
  --kill_pids             Destroy PIDS inside tmp/pids
  -h, --help              Display help
`)
}

module.exports = function() {
  const task_name = Argv.main.fetch()._[0]
  const task      = Tasks.getTask(task_name)

  if (task) { return TaskDescription(task_name, task) }
  Documentation()
}
