#!/usr/bin/env node
'use strict';

const subarg = require('subarg');

const Args = (function(){

  return subarg(process.argv.slice(2), {
    'boolean': ['w', 'm', 's'],
    'alias': {
      i: ['input'],
      w: ['watch'],
      b: ['build', 'dist'],
      o: ['output', 'out'],
      m: ['compress', 'minify', 'min'],
      s: ['sourcemaps'],
      c: ['config_path', 'configPath']
    },
    'default': {
      sourcemaps: false,
      compress: false,
      watch: false,
      config_path: false
    }
  })

})()

module.exports = Args
