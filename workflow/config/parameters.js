const Tasks = require('./tasks')

module.exports = {

  input: {
    type: 'file',
    aliases: [ 'i', 'in' ],
    extensions: [ '.js', '.ts', '.sass', '.scss', '.styl' ]
  },

  output: {
    type: 'file',
    aliases: [ 'o', 'out' ],
    extensions: [ '.js', '.css' ]
  },

  watch: {
    type: 'boolean',
    aliases: [ 'w' ],
    default: false
  },

  compress: {
    type: 'boolean',
    default: false,
    aliases: [ 'm', 'min', 'minify' ]
  },

  sourcemap: {
    type: 'boolean',
    aliases: [ 's' ],
    default: false
  },

  verbose: {
    type: 'boolean',
    default: false,
    aliases: [ 'v', 'debug' ]
  },

  help: {
    type: 'boolean',
    default: false,
    aliases: [ 'h' ]
  },

  kill_pids: {
    type: 'boolean',
    default: false,
    aliases: [ 'kill', 'clean' ]
  },

  task: {
    type: 'select',
    aliases: [ 't', 'tsk' ],
    values: Tasks.tasks,
    first_argument: true
  },

  ENV: {
    type: 'select',
    default: 'development',
    aliases: [ 'env', 'e' ],
    values: [ 'production', 'staging', 'development' ]
  }

}