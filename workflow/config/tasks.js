const paths = require('./paths')
const _ = require('../lib/functions/object')

const _tasks = {}

//_tasks['typescript'] = [
//  {
//    file: `./app/index.ts ./public/main.js`,
//    options: {},
//    override_parameters: {}
//  }
//]

//_tasks['uglify'] = [
//  {
//    file: `./public/main.js ./public/main.js`,
//    options: {},
//    override_parameters: {}
//  }
//]

//_tasks['stylus'] = [
//  {
//    file: `./app/index.styl ./public/main.css`,
//    options: {},
//    override_parameters: {}
//    autoprefixer: {remove: false, browsers: ["ie 9", "last 2 versions", "safari 7"]}
//  }
//]

//_tasks['postcss'] = [
//  {
//    file: `./app/index.css ./public/main.css`,
//    options: {},
//    override_parameters: {}
//  }
//]

//_tasks['sass'] = [
//  {
//    file: `./app/index.sass ./public/main.css`,
//    options: {},
//    override_parameters: {}
//  }
//]

//_tasks['watcher'] = [
//  {
//    file: './public/**/*',
//    options: {},
//    override_parameters: {
//      watch: true
//    }
//  }
//]

//_tasks['server'] = [
//  {
//    options: {
//      files: ['./public/**/*'],
//      'no-open': true,
//      server: './public'
//    },
//    override_parameters: {
//      watch: true
//    }
//  }
//]


// const browserify_options = {
//  options: {
//    cache: {},
//    packageCache: {},
//    extensions: [ '.js', '.es' ],
//    paths: [
//      './app'
//    ]
//  },
//  transforms: {
//    babelify: {
//      modules: "common",
//      compact: false,
//      comments: true
//    },
//    partialify: [ 'svg', 'txt' ],
//    watchify: {
//      delay: 600
//    }
//  }
// }

// _tasks['browserify'] = [
//   _.extend( browserify_options, {
//     file: `./app/index.js ./public/main.js`,
//     override_parameters: {}
//   }),

//   _.extend( browserify_options, {
//     file: `./app/vendor/index.js ./public/vendor.js`,
//     override_parameters: {
//       watch: false
//     }
//   })
// ]

//_tasks['template'] = [{
//  section: {
//    output: 'index',
//    destination_path: './app/sections',
//    files: [
//      'section.html',
//      'stylus/section.styl',
//      'js'
//    ]
//  },
//  components: {
//    destination_path: './app/components',
//    files: [
//      'stylus/section.styl',
//      'js/section.js'
//    ]
//  }
//}]

//_tasks['clean'] = [{}]

module.exports = _tasks
