#!/usr/bin/env node
'use strict';

const bs          = require('browser-sync')
const Task        = require('./../lib/Task')

class Server extends Task {

  execute() {
    const config  = this.getConfig()
    const options = config.options || {}

    this.bs = bs.create()
    this.bs.init(options)

    super.execute()
  }

  kill() {
    this.bs.exit()
    super.kill()
  }

}

module.exports = Server
