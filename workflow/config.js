const paths = require('./config/paths')

const _files = {}

_files['typescript'] = [
  {
    file: `./app/index.ts ./public/main.js`,
    override_parameters: {
      sourcemaps: false,
      watch: false,
      compress: false
    }
  }
]

_files['uglify'] = [
  {
    file: `./public/main.js ./public/main.js`
  }
]

_files['stylus'] = [
  {
    file: `./app/index.styl ./public/main.css`
  }
]

_files['postcss'] = [
  {
    file: `./app/index.css ./public/main.css`
  }
]

_files['sass'] = [
  {
    file: `./app/index.sass ./public/main.css`
  }
]

_files['watcher'] = [
  {
    file: './public/**/*'
  }
]


_files['browserify'] = [
  {
    file: `./app/index.js ./public/main.js`,
    options: {
      cache: {},
      packageCache: {},
      extensions: [ '.js', '.es' ],
      paths: [
        './app'
      ]
    },
    transforms: {
      babelify: {
        modules: "common",
        compact: false,
        comments: true
      },
      partialify: [ 'svg', 'txt' ],
      watchify: {
        delay: 600
      }
    }
  }
]

module.exports = function(task_name) {
  return _files[task_name]
}