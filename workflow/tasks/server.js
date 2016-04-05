#!/usr/bin/env node
'use strict';

const bs          = require('browser-sync')
const Task        = require('./../lib/Task')

class Server extends Task {

  execute() {
    super.execute()

    const config  = this.getConfig()
    const pattern = config.files
    const options = config.options || {}

    this.bs = bs.create()
    this.bs.watch(pattern, options)
    this.bs.init(options)
  }

  kill() {
    this.bs.exit()
    super.kill()
  }

}

module.exports = Server
