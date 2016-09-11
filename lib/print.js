'use strict'

const _colors = require('./utils/colors')
const pad     = require('./utils/string').pad

class Print {

  constructor(options) {
    Object.assign(this, _colors)

    this.levels  = {}
    this.plugins = {}

    Print.defaultLevels( this )
    Print.defaultPlugins( this )

    if (typeof options === 'object') {
      Object.assign(this, options)
    }
  }

  new(options) {
    return new Print(options)
  }

  level(level, options) {

    this.levels[level] = Object.assign({
      visible: true
    }, options || {})

    this[level] = function() {
      let str = [...arguments].join(' ')

      // Test log level visibility
      if (!this.levels[level].visible) return

      // Apply options
      str = this.applyPlugins( this.levels[level], str )

      this._log( str )
    }

  }

  plugin(name, fn, useByDefault) {
    this.plugins[name] = fn.bind(this)
    this['use_'+name]  = typeof useByDefault === 'boolean' ? useByDefault : true
  }

  applyPlugins(level, str) {
    for (const key in level) {
      if (this.plugins[key] && this['use_' + key]) {
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

  visibility(level, visibility) {
    if (this.levels[level]) {
      this.levels[level].visible = visibility
    }
  }

  silent() {
    for (const key in this.levels) {
      this.visibility(key, false)
    }
  }

  defaults() {
    this.visibility('log'    , true)
    this.visibility('debug'  , true)
    this.visibility('warn'   , true)
    this.visibility('verbose', true)
  }

  _log() {
    console.log([...arguments].join(' '))
  }

}


/**
 * Setup default log levels
 */
Print.defaultLevels = function(PrintObject) {
  PrintObject.level('log')
  PrintObject.level('debug', {
    date: true
  })

  PrintObject.level('warn', {
    style: 'yellow',
    tag: {
      tag: '?!',
      style: 'yellow'
    },
    date: true
  })

  PrintObject.level('error', {
    style: 'red',
    tag: {
      tag: '!!',
      style: 'red'
    },
    date: true
  })

  PrintObject.level('verbose', {
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
  }, false)

  PrintObject.plugin('date', function(str) {
    const d = new Date();
    const h = pad(d.getHours(), 2)
    const m = pad(d.getMinutes(), 2)
    const s = pad(d.getSeconds(), 2)

    const date = this.cyan(`[${h}:${m}:${s}]`)
    return `${date} ${str}`
  })

}






module.exports = new Print