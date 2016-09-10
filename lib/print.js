'use strict'

const _       = require('./functions/utils')
const _colors = require('./functions/colors')

class Print {

  constructor(options) {
    Object.assign(this, _colors)
    this.use_date  = true
    this.use_tag   = true
    this.use_style = true
    this.silent    = false

    this.visibleLevels = [
      'debug',
      'warn',
      'error',
      'verbose'
    ]

    this.logLevels = {}
    this.plugins   = {}

    Print.defaults(this)

    if (typeof options === 'object') {
      Object.assign(this, options)
    }
  }

  new(options) {
    return new Print(options)
  }

  _log() {
    if (this.silent) return

    let str = [...arguments].join(' ')

    if (!this.use_style) {
      str = this.chalk.stripColor(str)
    }

    console.log(str)
  }

  createLogLevel(level, options) {

    options = options || {}
    this.logLevels[level] = options

    if (options.visible === undefined || options.visible) {
      this.visibleLevels.push( level )
    }

    this[level] = function() {
      let str = [...arguments].join(' ')

      // Test log level visibility
      if (this._testVisibility(level)) return

      // Apply options
      str = this.applyPlugins( this.logLevels[level], str )

      this._log( str )
    }

  }

  plugin(name, fn) {
    this.plugins[name] = fn.bind(this)
  }

  applyPlugins(level, str) {
    for (const key in level) {
      if (this.plugins[key]) {
        str = this.plugins[key](str, level[key])
      }
    }

    return str
  }

  /**
   *
   * @param string
   * @returns {string}
   */
  clean(value) {
    if (value === undefined) return
    return value.toString().replace(/^(\s|\n)+|(\s|\n)+$/g, '')
  }

  _testVisibility(level) {
    return this.visibleLevels.indexOf(level) === -1
  }

}


Print.defaults = function(PrintObject) {
  Print.defaultLogLevels( PrintObject )
  Print.defaultPlugins( PrintObject )
}

/**
 * Setup default log levels
 */
Print.defaultLogLevels = function(PrintObject) {
  PrintObject.createLogLevel('log')
  PrintObject.createLogLevel('debug', {
    date: true
  })

  PrintObject.createLogLevel('warn', {
    style: 'yellow',
    tag: {
      tag: '?!',
      style: 'yellow'
    },
    date: true
  })

  PrintObject.createLogLevel('error', {
    style: 'red',
    tag: {
      tag: '!!',
      style: 'red'
    },
    date: true
  })

  PrintObject.createLogLevel('verbose', {
    style: 'gray',
    tag: {
      tag: '~~',
      style: 'gray'
    },
    date: true
  })
}

/**
 * Setup default plugins
 */
Print.defaultPlugins = function(PrintObject) {
  PrintObject.plugin('style', function(str, style) {
    return this[style]( str )
  })

  PrintObject.plugin('tag', function(str, o) {
    const tag = this[o.style](`[${o.tag}]`)
    return `${tag} ${str}`
  })

  PrintObject.plugin('date', function(str) {
    if (!this.use_date) return str

    const _ = require('./../lib/functions/utils')
    const d = new Date();
    const h = _.pad(d.getHours(), 2)
    const m = _.pad(d.getMinutes(), 2)
    const s = _.pad(d.getSeconds(), 2)

    const date = this.cyan(`[${h}:${m}:${s}]`)
    return `${date} ${str}`
  })
}






module.exports = new Print