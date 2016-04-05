#!/usr/bin/env node
'use strict';

const bs    = require('browser-sync')
const Print = require('./../lib/Print')
const Task  = require('./../lib/Task')

class Watch extends Task {

  constructor() {
    super(...arguments)
    this.bs = null
  }

  execute() {
    super.execute()

    const config  = this.getConfig()
    const pattern = config.file
    const options = config.options || {}

    this.bs = bs.create()

    const watcher = this.bs.watch(pattern, options)
    const name    = this.name

    watcher.on('ready', function(file) {
      Print.log(`[${name}] Ready to watch`, true, 'magenta')
      this.on('add', function(file){
        Print.log(`[${name}] Add ${file}`, true, 'magenta')
      })
    })

    watcher.on('change', function(file) {
      Print.log(`[${name}] Change ${file}`, true, 'magenta')
    })

    watcher.on('unlink', function(file) {
      Print.log(`[${name}] Remove ${file}`, true, 'magenta')
    })
  }

  kill() {
    this.bs.exit()
    super.kill()
  }

}

module.exports = Watch
