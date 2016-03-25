#!/usr/bin/env node
'use strict';

const requiredir = require('./lib/require_dir')
const Lib        = requiredir(`./lib`)
const Tasks      = requiredir(`./tasks`)

// Fetch arguments
const options = Lib.args

// Fetch first argument as action
const action = options._[0]

// Load config file
const Config = Lib.config(options.config_path)

if (!Config || !Config[action]) {
  Lib.print.log('Please setup "config.yml"', true, 'yellow')
  return
}

// Execute tasks
if (Tasks.hasOwnProperty(action)) {
  options.config = Config[action]

  // Execute the task for each input/output
  let paths = options.config.files
  for (let path, i = 0; i < paths.length; i++) {
    path = paths[i].split(' ')
    options.i = options.input = path[0]
    options.o = options.out   = options.output = path[1]
    Tasks[action](options)
  }

  return
}

Lib.print.log('No action found.', true, 'yellow')

// Execute templates
Lib.print.log('Execute template task', true, 'white')
options.config = Config['template']
Lib.template.create(options)
