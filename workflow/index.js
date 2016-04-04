'use strict'
const Argv     = require('./lib/Argv')

const execute = function() {
  const Print     = require('./lib/Print')
  const task_name = Argv.fetch()._[0]
  const config    = require('./config')(task_name)

  if (!config) {
    Print.log(`'${task_name}' is not configured. Please setup "config.yml"`, true, 'yellow')
    return
  }

  const task = require(`./tasks/${task_name}`)
  for (let i = 0, len = config.length; i < len ; i++) {
    task.create(task_name, config[i]).execute()
  }
}


/**
 * Detect npm execution
 */
const isNPM = !!(process.env.npm_package_name)

if (isNPM) {
  const scripts  = require('../package.json').scripts
  const commands = Argv.fetch()._

  if (commands.length > 1) {
    for (let len = commands.length, i = 0; i < len; i++) {
      if (scripts.hasOwnProperty(commands[i])) {
        Argv.replace(scripts[commands[i]].split(' ').slice(2))
        execute()
      }
    }

    return
  }

}

execute()