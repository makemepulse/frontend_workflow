'use strict'

require('./lib/workflow')

namespace('hello', function() {

  task('world', { async: true }, function( complete ) {
    console.log('Hello World')
    complete()
  })

  command('bash', { async: true }, 'sleep 5')
  command('plop', { async: true }, 'echo plop')

  task('ultime', ['hello:world', 'hello:bash', 'hello:plop'], function() {
    console.log('ULTIME')
  })

  // namespace('world', function() {

  //   desc('Execute a hello world')
  //   task('hello', function() {
  //     console.log('Hello World')
  //   })

  //   desc('Execute a surprise')
  //   task('surprise', function() {
  //     console.log('Surprise motherfucka')
  //   })

  //   task('plop', ['hello', 'surprise'], function() {
  //     console.log('Surprise motherfucka')
  //   })

  //   task('yolo', { async: true }, function() {
  //     console.log('Yolo')
  //   })

  //   task('plouf', ['plop', 'yolo'], { async: true }, function() {
  //     console.log('Surprise motherfucka')
  //   })

  // })

})

// serie( 'hello:ultime' )

// const TaskManager = require('./lib/task-manager')
// console.log(TaskManager.tasks)

// TaskManager.parallel('hello', 'surprise')

// const ARGParser  = require('./lib/arg-parser')
// ARGParser.config = require('./config/parameters')
// const parameters = ARGParser.parse(process.argv.slice(2))

// const TaskManager = require('./lib/task-manager')
// const SCRIPTS = require('./config/tasks')

// // Generate tasks for non-scripts from parameters
// const TASKS = parameters._._;

// for (const i in TASKS) {
//   if (!TaskManager.tasks[TASKS[i]]) {
//     TASKS[i] = TaskManager.registerCommand(TASKS[i])
//   }
// }

// if (typeof TaskManager[parameters.sequence] === 'function' && parameters._._.length > 0) {
//   TaskManager[parameters.sequence](parameters._._)
// }