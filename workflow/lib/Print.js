#!/usr/bin/env node
'use strict'

const Print = (function(){

  const _colors = require('colors/safe')
  const Argv    = require('./Argv')

  const _log = function(value, withDate, color) {
    color    = color || null
    withDate = withDate || false
    if (color) {
      if (withDate) console.log(_colors['cyan'](_time()), _colors[color](`${value}`))
      else console.log(_colors[color](`${value}`))
    } else {
      if (withDate) console.log(_time(), value)
      console.log(value)
    }
  }

  const _time = function() {
    const d = new Date();
    const h = _pad(d.getHours(), 2)
    const m = _pad(d.getMinutes(), 2)
    const s = _pad(d.getSeconds(), 2)
    return `[${h}:${m}:${s}]`
  }

  const _pad = function(value, max) {
    let s = value.toString();
    return s.length < max ? _pad("0"+value, max) : s
  }

  const _clean = function(string) {
    return string.replace(/^(\s|\n)+|(\s|\n)+$/g, '')
  }

  const _verbose = function() {
//    const verbose = process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--verbose') !== -1
    const verbose = Argv.fetch().verbose
//    console.log(Argv.fetch())
    if (verbose) _log(...arguments)
  }

  return {
    log: _log,
    time: _time,
    clean: _clean,
    colors: _colors,
    verbose: _verbose
  }

})()

module.exports = Print
