#!/usr/bin/env node
'use strict'

const _colors = require('colors/safe')

class Print {

  constructor() {
    this.argv   = require('./Argv').main
    this.colors = _colors
    this.setup()
  }

  setup() {
    //    const verbose = process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--verbose') !== -1
    this.verbose = this.argv.fetch().verbose
  }

  /**
   * console.log with colors
   * @param {*} value
   * @param {string|Object} [color_or_options={}]
   * @param {boolean} [color_or_options.no_color=false] color_or_options.no_color
   * @param {boolean} [color_or_options.use_date=true] color_or_options.use_date
   * @param {string} [color_or_options.color]
   *
   */
  log(value, color_or_options) {
    if (value === undefined) return

    const opts     = typeof color_or_options === 'object' ? color_or_options : {}
    let color      = typeof color_or_options === 'string' ? color_or_options : null
    color          = opts.color || color
    const use_date = typeof opts.use_date === 'boolean' ? opts.use_date : true
    const no_color = typeof opts.no_color === 'boolean' ? opts.no_color : false

    // Transform value to string
    let string = typeof value === 'string' ? [value] : [value.toString()]
    string     = string.join(' ')

    if (no_color) {
      string = _colors['strip'](string)
    } else if (color) {
      string = _colors[color](_colors['strip'](string))
    }

    if (use_date) {
      let time = this.getTime()
      let date = no_color ? time : _colors['cyan'](time)
      console.log('%s %s', date, string)
      return
    }

    console.log('%s', string)
  }

  /**
   *
   * @returns {string}
   */
  getTime() {
    const d = new Date();
    const h = this.pad(d.getHours(), 2)
    const m = this.pad(d.getMinutes(), 2)
    const s = this.pad(d.getSeconds(), 2)
    return `[${h}:${m}:${s}]`
  }

  /**
   *
   * @param {string} value
   * @param {number} max
   * @returns {string}
   */
  pad(value, max) {
    if (value === undefined) return
    let s = value.toString();
    return s.length < max ? this.pad("0"+value, max) : s
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

  /**
   * console.log with colors only verbose mode activated
   * @param {*} value
   * @param {string|Object} [color_or_options={}]
   * @param {boolean} [color_or_options.no_color=false] color_or_options.no_color
   * @param {boolean} [color_or_options.use_date=true] color_or_options.use_date
   * @param {string} [color_or_options.color]
   */
  verbose(value, color_or_options) {
    if (this.verbose) this.log(value, color_or_options)
  }

}

const _print = new Print
module.exports = _print
