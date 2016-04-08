const paths = {
  app: './workflow/test/app',
  public: './workflow/test/public'
}

const _tasks = {}

_tasks['typescript'] = [
  {
    file: `${paths.app}/index.ts ${paths.public}/main.js`,
    options: {},
    override_parameters: {}
  }
]

_tasks['uglify'] = [
  {
    file: `${paths.public}/main.js ${paths.public}/main.js`,
    options: {},
    override_parameters: {}
  }
]

_tasks['stylus'] = [
  {
    file: `${paths.app}/index.styl ${paths.public}/main.css`,
    options: {},
    override_parameters: {}
  }
]

_tasks['postcss'] = [
  {
    file: `${paths.app}/index.css ${paths.public}/main.css`,
    options: {},
    override_parameters: {}
  }
]

_tasks['sass'] = [
  {
    file: `${paths.app}/index.sass ${paths.public}/main.css`,
    options: {},
    override_parameters: {}
  }
]

_tasks['watcher'] = [
  {
    file: `${paths.public}/**/*`,
    options: {},
    override_parameters: {
      watch: true
    }
  }
]

_tasks['server'] = [
  {
    options: {
      files: `${paths.public}/**/*`,
      open: false,
      server: `${paths.public}`
    },
    override_parameters: {
      watch: true
    }
  }
]


const browserify_options = {
  options: {
    cache: {},
    packageCache: {},
    extensions: [ '.js', '.es' ],
    paths: [
      `${paths.app}`
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

_tasks['browserify'] = [
  Object.assign({
    file: `${paths.app}/index.js ${paths.public}/main.js`,
    options: {},
    override_parameters: {}
  }, browserify_options),

  Object.assign({
    file: `${paths.app}/vendor/index.js ${paths.public}/vendor.js`,
    options: {},
    override_parameters: {
      watch: false
    }
  }, browserify_options)
]

_tasks['template'] = [{
  section: {
    output: 'index',
    destination_path: `${paths.app}/sections`,
    files: [
      'section.html',
      'stylus/section.styl',
      'js'
    ]
  },
  components: {
    destination_path: `${paths.public}/components`,
    files: [
      'stylus/section.styl',
      'js/section.js'
    ]
  }
}]

module.exports = _tasks
