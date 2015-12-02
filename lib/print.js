#!/usr/bin/env node
'use strict'


const Print = (function(){

  const _colors = require('colors/safe')

  const _log = function(value, withDate, color) {
    color    = color || null
    withDate = withDate || false
    if (color) {
      if (withDate) console.log(_colors['cyan'](_time()), _colors[color](`${value}`))
      else console.log(_colors[color](`${value}`))
    } else {
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

  return {
    log: _log,
    time: _time,
    clean: _clean,
    colors: _colors
  }

})()

module.exports = Print
