#!/usr/bin/env node
'use strict';

const bs    = require('browser-sync')
const Print = require('./../lib/Print')
const Task  = require('./../lib/Task')

class Watcher extends Task {

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
      Print.log(`[${name}] Ready to watch`, 'magenta')
      this.on('add', function(file){
        Print.log(`[${name}] Add ${file}`, 'magenta')
      })
    })

    watcher.on('change', function(file) {
      Print.log(`[${name}] Change ${file}`, 'magenta')
    })

    watcher.on('unlink', function(file) {
      Print.log(`[${name}] Remove ${file}`, 'magenta')
    })
  }

  kill() {
    this.bs.exit()
    super.kill()
  }

}

Watcher.description = 'Watch files'

module.exports = Watcher
