#!/usr/bin/env node
'use strict';

const Task           = require('./../lib/Task')
const ProcessManager = require('./../lib/ProcessManager')

class Clean extends Task {

  execute() {
    super.execute()
    ProcessManager.clean()
  }

}

Clean.description = `Kill all process available inside workflow/tmp/`

module.exports = Clean
