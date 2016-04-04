const options = {
  i: './app/index.sass',
  o: './public/main.css.erb',
  compass: true,
  config: {
    autoprefixer: "",
    files: "./public/**/*",
    options: {}
  },
  watch: false
}

/**
 * Test Stylus compilation
 * @type {Stylus class}
 */
const Stylus = require('./tasks/stylus')
options.i = './app/index.styl'
options.o = './public/main.css'
Stylus.create(options).execute()

/**
 * Test PostCSS compilation
 * @type {PostCSS class}
 */
const PostCSS = require('./tasks/postcss')
options.i = './app/index.css'
options.o = './public/main.css'
PostCSS.create(options).execute()

/**
 * Test SASS compilation
 * @type {SASS class}
 */
const SASS = require('./tasks/sass')
options.i = './app/index.sass'
options.o = './public/main.css.erb'
SASS.create(options).execute()

/**
 * Test Typescript compilation
 * @type {Typescript class}
 */
const Typescript = require('./tasks/typescript')
options.i = './app/index.ts'
options.o = './public/main.js'
Typescript.create(options).execute()

/**
 * Test Uglify compilation
 * @type {Uglify class}
 */
const Uglify = require('./tasks/uglify')
options.i = './public/main.js'
options.o = './public/main.js'
Uglify.create(options).execute()

/**
 * Test Watcher
 * @type {Watcher class}
 */
const Watcher = require('./tasks/watcher')
options.files = [ './public/**/*' ]
Watcher.create(options).execute()

/**
 * Test Server
 * @type {Server class}
 */
const Server = require('./tasks/server')
options.files = [ './public/**/*' ]
options.config.server =  "./public"
options.config.open = false
Server.create(options).execute()