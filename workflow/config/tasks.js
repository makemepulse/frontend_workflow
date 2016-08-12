'use strict'


// // var Readable = require('stream').Readable;
// // var rs = Readable();

// // var c = 97 - 1;

// // rs._read = function () {
// //     if (c >= 'z'.charCodeAt(0)) {
// //       return rs.push(null);
// //     }

// //     setTimeout(function () {
// //         rs.push(String.fromCharCode(++c));
// //     }, 100);
// // };

// // rs.pipe(process.stdout);

// // process.on('exit', function () {
// //     console.error('\n_read() called ' + (c - 97) + ' times');
// // });
// // process.stdout.on('error', process.exit);




// const when = require('when')

// let helloWorld = function(value) {
//   return 'Hello ' + value
// }

// helloWorld = when.lift(helloWorld)

// helloWorld('Chris').spread([function() {}, function() {}])

// console.log(  )

const _tasks = []

_tasks.push({
  input: './app/index.ts',
  output: './public/main.js',
  task: 'typescript',
  options: {}
})

_tasks.push({
  input: './app/index.styl',
  output: './public/main.css',
  task: 'stylus',
  options: {}
})

module.exports = _tasks

// class Task {
//   new(nameOrObject, object) {

//   }
// }

// Task.new('typescript', [
//   Task.new({
//     task: 'typescript',
//     input: './app/index.ts',
//     output: './public/main.js',
//     options: {}
//   }),
//   Task.new({
//     task: 'typescript',
//     input: './app/index.ts',
//     output: './public/main.js',
//     options: {}
//   })
// ])

// Task.new('typescript', {
//   task: 'typescript',
//   input: './app/index.ts',
//   output: './public/main.js',
//   options: {}
// })

// Task.execute('typescript')



// // const paths = require('./paths')
// // const _ = require('../lib/functions/object')

// // const _tasks = {}

// // _tasks['typescript'] = [
// //   {
// //     file: `./app/index.ts ./public/main.js`,
// //     options: {}
// //   }
// // ]

// // _tasks['uglify'] = [
// //   {
// //     file: `./public/main.js ./public/main.js`,
// //     options: {}
// //   }
// // ]

// // _tasks['stylus'] = [
// //   {
// //     file: `./app/index.styl ./public/main.css`,
// //     options: {},
// //     autoprefixer: {remove: false, browsers: ["ie 9", "last 2 versions", "safari 7"]}
// //   }
// // ]

// // _tasks['postcss'] = [
// //   {
// //     file: `./app/index.css ./public/main.css`,
// //     options: {}
// //   }
// // ]

// // _tasks['sass'] = [
// //   {
// //     file: `./app/index.sass ./public/main.css`,
// //     options: {}
// //   }
// // ]

// // _tasks['watcher'] = [
// //   {
// //     file: './public/**/*',
// //     options: {},
// //     watch: true
// //   }
// // ]

// // _tasks['server'] = [
// //   {
// //     file: './public/**/*',
// //     options: {
// //       files: ['./public/**/*'],
// //       'no-open': true,
// //       server: './public'
// //     },
// //     watch: true
// //   }
// // ]


// // const browserify_options = {
// //   options: {
// //     cache: {},
// //     packageCache: {},
// //     extensions: [ '.js', '.es' ],
// //     paths: [
// //       './app'
// //     ]
// //   },
// //   transforms: {
// //     babelify: {
// //       modules: "common",
// //       compact: false,
// //       comments: true
// //     },
// //     partialify: [ 'svg', 'txt' ],
// //     watchify: {
// //       delay: 600
// //     }
// //   }
// // }

// // _tasks['browserify'] = [
// //   _.extend({
// //     file: `./app/index.js ./public/main.js`
// //   }, browserify_options),

// //   _.extend({
// //     file: `./app/vendor/index.js ./public/vendor.js`,
// //     watch: false
// //   }, browserify_options)
// // ]

// // _tasks['template'] = [{
// //   section: {
// //     output: 'index',
// //     destination_path: './app/sections',
// //     files: [
// //       'section.html',
// //       'stylus/section.styl',
// //       'js'
// //     ]
// //   },
// //   components: {
// //     destination_path: './app/components',
// //     files: [
// //       'stylus/section.styl',
// //       'js/section.js'
// //     ]
// //   }
// // }]

// // _tasks['clean'] = [{}]

// // module.exports = _tasks
