const paths = require('./paths')

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


//const browserify_options = {
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
//}

//_tasks['browserify'] = [
//  Object.assign({
//    file: `./app/index.js ./public/main.js`,
//    options: {},
//    override_parameters: {}
//  }, browserify_options),
//
//  Object.assign({
//    file: `./app/vendor/index.js ./public/vendor.js`,
//    options: {},
//    override_parameters: {
//      watch: false
//    }
//  }, browserify_options)
//]

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
//    destination_path: './public/components',
//    files: [
//      'stylus/section.styl',
//      'js/section.js'
//    ]
//  }
//}]

//_tasks['clean'] = [{}]

module.exports = _tasks
