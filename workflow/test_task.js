'use strict'

// const EventEmitter = require('events').EventEmitter
// const NaL          = require('now-and-later')
// const _            = require('./lib/functions/object')

// const _tasks       = {}

// class Task extends EventEmitter {
//   constructor(name, parameters) {
//     super()

//     this.parameters = parameters ? _.clone(parameters) : {}
//     this._name      = name || 'noname'
//     this.running    = false
//     this.execute = this.execute.bind(this)

//   }

//   execute(resolve, reject) {
//     console.log('START')
//     setTimeout(function() {
//       resolve('task')
//     }, 2000)
//   }

// }

// const exec = require('child_process').exec

// class Typescript extends Task {
//   execute(resolve, reject) {

//     console.log('START')

//     const cmd = [
//       'tsc', './app/index.ts', '--out', './public/main.js'
//     ]

//     const process = exec(cmd.join(' '))

//     process.stdout.on('data', function(str) {
//       console.log(str.toString('utf8'))
//     })

//     process.stderr.on('data', function(str) {
//       console.log(str.toString('utf8'))
//     })

//     process.on('close', function() {
//       resolve('typescript')
//     })

//   }
// }






// Task.register = function(name, fnOrObject) {

//   if (_tasks.hasOwnProperty(name)) return

//   let parameters = fnOrObject
//   if (typeof fnOrObject === 'function') {
//     parameters = fnOrObject() || parameters
//   }

//   _tasks[name] = parameters//new Task(name, parameters)

// }

// Task.register('task0', function() {
//   return {
//     input: './app/index.ts',
//     output: './public/main.js',
//     compiler: 'typescript',
//     options: {}
//   }
// })

// Task.register('task1', {
//   input: './app/index.styl',
//   output: './public/main.css',
//   compiler: 'stylus',
//   options: {}
// })

// Task.register('task2', {
//   input: './app/index.js',
//   output: './public/main.js',
//   compiler: 'browserify',
//   options: {}
// })

// Task.register('task3', function() {
//   return {
//     tasks: ['task0', 'task1'],
//     compiler: 'sequence'
//   }
// })

// Task.register('task4', {
//   tasks: [['task0', 'task2'], 'task1'],
//   compiler: 'sequence'
// })

// Task.execute = function() {
//   let names    = [...arguments]
//   let callback = function() {}

//   if (typeof names[names.length-1] === 'function') {
//     callback = names[names.length-1]
//     names    = names.slice(0, names.length-1)
//   }

//   const deepMap = function(value) {
//     if (Array.isArray(value)) {
//       return value.map(deepMap)
//     }
//     return _tasks[value] || value
//   }

//   const tasks = names.map(deepMap)
//   sequence(tasks, callback)
// }

// const sequence = function(tasks, callback) {

//   const serie = function(task, cb) {
//     if (Array.isArray(task)) {
//       NaL.map(task, parallel, cb)
//     } else {
//       exec( task, cb )
//     }
//   }

//   const parallel = function(task, cb) {
//     if (Array.isArray(task)) {
//       sequence(task, cb)
//     } else {
//       exec( task, cb )
//     }
//   }

//   const exec = function(task, cb) {
//     if (task) {
//       console.log(task)
//     }
//     cb()
//   }

//   NaL.mapSeries(tasks, serie, callback)

// }

// // Task.execute( 'task0', ['task1', 'task2', ['task1', 'task2', ['task1', 'task2']]], 'task3', 'task4', function() {
// //   console.dir('Executed with success')
// // })

// // const when = require('when')
// // const task0 = new Task('task0')
// // const task1 = new Typescript('task1')

// // const p0 = (when.promise(task0.execute)).then(function() {
// //   return when.promise(task1.execute)
// // }).done(function() {
// //   console.log(arguments)
// // })


// // when.reduce([
// //   when.promise(task0.execute),
// //   when.promise(task1.execute),
// // ], function(res, value) {
// //   console.log('END')
// //   res.push(value)
// //   return res
// // }, []).then(function() {
// //   console.log(arguments)
// // })

// // when.all([
// //   new Promise(task0.execute),
// //   new Promise(task1.execute)
// // ]).done(function() {
// //   console.log('---------', arguments)
// // })



// const Bind = (function() {

//   const _bind = function(fnNameOrArray, ctx) {
//     if (!ctx) ctx = this
//   }

//   const _exports = {
//     bind: _bind,
//     unbind: _unbind,
//   }

//   return function(object) {
//     if (!object.bind) Object.assign(this, _exports)
//   }
// })()

// class TaskClass {

//   constructor() {
//     Bind(this, ['execute'])
//   }

//   execute() {
//     console.log(this)
//   }
// }

// const hello = new TaskClass


// setTimeout(hello.execute, 1000)











// const when = require('when')

// // let myPromise = when.promise(function(res, rej) {
// //   // console.log(res, rej)

// //   // while(true) {

// //   // }

// //   // res('Hello World')
// // })
// // .then(function() {
// //   console.log('SUCCESS')
// // })
// // .catch(function() {
// //   console.log('FAIL')
// // }).delay(5000)

// // console.log(when.resolve(myPromise))


// // const testPromise = when('test')

// // testPromise.then(function(value) {
// //   console.log(arguments)
// //   return value
// // }).then(function(value) {
// //   console.log(arguments)
// // })

// // const testPromise = when('test')

// // when.resolve(testPromise).then(function(value) {
// //   console.log('then', arguments)
// //   return 'hello world'
// // }).catch(function() {
// //   console.log('catch', arguments)
// // }).done(function() {
// //   console.log(arguments)
// // })

// // when.resolve(testPromise).then(function(value) {
// //   console.log(2, value)
// // })

// // let helloWorld = function(value) {
// //   return 'Hello ' + value
// // }

// // helloWorld = when.lift(helloWorld)

// // helloWorld('Chris').spread([function() {}, function() {}])

// // console.log(  )



// const sequence = require('when/sequence')

// const task0 = (a,b,c) => {
//   console.log(a,b,c)
//   return 'task0';
// }
// const task1 = () => { return 'task1' }
// const task2 = () => { return 'task2' }

// sequence([task0, task1], task2).then(function() {
//   // console.log(arguments)
// }).then(function() {
//   // console.log(arguments)
// })













const Typescript = require('./tasks/typescript')
const Browserify = require('./tasks/browserify')

const task0 = new Typescript('test_typescript', {
  input: './app/index.ts',
  output: './public/main.ts.js'
})

const task1 = new Browserify('test_browserify', {
  input: './app/index.js',
  output: './public/main.b.js',
  options: {}
})

task1.on('kill', function() {
  console.log('Execute task0')
  task0.execute()
    console.log(task0.ps.killed)
  task0.on('kill', function() {
    setTimeout(function() {
      console.log(task0.ps.killed)
    }, 5000)
  })
})
console.log('Execute task1')
task1.execute()



