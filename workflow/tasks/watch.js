#!/usr/bin/env node
'use strict';

const chokidar = require('chokidar')
const Print    = require('./../lib/Print')

const Watch = function(options) {

  const pattern = options.config.files
  const params  = options.config.options

  const watcher = chokidar.watch(pattern, params)

  watcher.on('ready', function(file) {
    Print.log('Ready to watch', true)
    this.on('add', function(file){
      Print.log(`[Watcher] Add ${file}`, true, 'magenta')
    })
  })

  watcher.on('change', function(file) {
    Print.log(`[Watcher] Change ${file}`, true, 'magenta')
  })

  watcher.on('unlink', function(file) {
    Print.log(`[Watcher] Remove ${file}`, true, 'magenta')
  })

  return watcher

}

module.exports = Watch
