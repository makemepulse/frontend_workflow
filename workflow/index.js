#!/usr/bin/env node
'use strict';

const requiredir = require('./lib/require_dir')
const Lib        = requiredir(`./lib`)
const Tasks      = requiredir(`./tasks`)

const options = Lib.args
const action  = options._[0]
const Config  = Lib.config(options)

switch (action) {
  case 'template': {
    Lib.template.create(options)
    break;
  }
  default: {

    if (Tasks.hasOwnProperty(action)) {
      options.config = Config[action]

      let paths = options.config.files
      for (let path, i = 0; i < paths.length; i++) {
        path = paths[i].split(' ')
        options.i = options.input = path[0]
        options.o = options.out = options.output = path[1]
        Tasks[action](options)
      }

      return
    }

    Lib.print.log('No action found', true, 'yellow')
  }
}
