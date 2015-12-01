#!/usr/bin/env node
'use strict';

const requiredir = require('./lib/require_dir')
const Lib        = requiredir(`./lib`)
const Tasks      = requiredir(`./tasks`)
const Config     = Lib.config

let options = Lib.args
let action  = options._[0]

// Execute tasks
if (Tasks.hasOwnProperty(action)) {
  options.config = Config[action]

  let paths = options.config.files
  for (let path, i = 0; i < paths.length; i++) {
    path = paths[i].split(' ')
    options.i = options.input = path[0]
    options.o = options.out = options.output = path[1]
    Tasks[action](options)
  }
}

// Execute libraries
else {

  switch (action) {
    case 'template': {
      Lib.template.create(options)
      break;
    }
    case 'symlink': {
      Lib.symlink(options)
      break;
    }
    default:
      Lib.print.log('No action found', true, 'yellow')
  }

}
