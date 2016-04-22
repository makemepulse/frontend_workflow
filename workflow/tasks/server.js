#!/usr/bin/env node
'use strict';

const path = require('path')
const TaskProcess = require('./../lib/TaskProcess')
const BROWSER_SYNC_CLI = path.join(path.dirname(require.resolve('browser-sync')), 'bin', 'browser-sync.js')

class Server extends TaskProcess {

  execute() {
    const config  = this.getConfig()
    const options = config.options || {}

    const command = [BROWSER_SYNC_CLI, 'start']
    let value = null

    for (let key in options) {
      value = options[key]
      if (typeof value === 'boolean') {
        if (value) command.push('--'+key)
      } else {
        if (typeof value !== 'string') value = value.toString()
        command.push(`--${key}='${value}'`)
      }
    }

    super.execute(command.join(' '))
  }

}

Server.description = `Start a HTTP server with BrowserSync`

module.exports = Server
