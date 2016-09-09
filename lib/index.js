'use strict'

require('./workflow')


/**
 * Imports tasks from package.json
 */
const fs   = require('fs')
const path = require('path')

const package_path = path.resolve('package.json')

if (fs.existsSync( package_path )) {
  const pkg     = require(package_path)
  const scripts = pkg.scripts || {}

  for (const key in scripts) {

    const parts = key.split(':')
    const name  = parts.pop()

    const createNS = function(parts) {
      const ns = parts.shift()
      namespace(ns, function() {
        if (parts.length > 0) {
          createNS(parts)
        } else {
          command(name, scripts[key])
        }
      })
    }

    if (parts.length) createNS(parts.slice(0))
    else command(name, scripts[key])
  }
}

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
