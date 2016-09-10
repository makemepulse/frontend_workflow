'use strict'

require('./workflow')
/**
 * Imports tasks
 */

const Importer = require('./importer')
Importer.import('./package.json')
Importer.import('./workflow/tasks')

/**
 * Execute tasks
 */
const ARGParser  = require('./arg-parser')
const PARAMS     = ARGParser.parse(process.argv.slice(2))
const TASKS      = PARAMS._._

if (TASKS.length) {
  if (PARAMS.sequence === 'parallel') {
    parallel( TASKS )
  } else {
    serie( TASKS )
  }
}

// serie( 'compile' )

// namespace('hello', function() {

//   task('world', { async: true }, function( complete ) {
//     console.log('Hello World')
//     complete()
//   })

//   command('bash', { async: true }, 'sleep 5')
//   command('plop', { async: true }, 'echo plop')

//   task('ultime', ['hello:world', 'hello:bash', 'hello:plop'], function() {
//     console.log('ULTIME')
//   })

//   // namespace('world', function() {

//   //   desc('Execute a hello world')
//   //   task('hello', function() {
//   //     console.log('Hello World')
//   //   })

//   //   desc('Execute a surprise')
//   //   task('surprise', function() {
//   //     console.log('Surprise motherfucka')
//   //   })

//   //   task('plop', ['hello', 'surprise'], function() {
//   //     console.log('Surprise motherfucka')
//   //   })

//   //   task('yolo', { async: true }, function() {
//   //     console.log('Yolo')
//   //   })

//   //   task('plouf', ['plop', 'yolo'], { async: true }, function() {
//   //     console.log('Surprise motherfucka')
//   //   })

//   // })

// })

// serie( 'hello:ultime' )
