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
      s: ['sourcemaps']
    },
    'default': {
      sourcemaps: false,
      compress: false,
      watch: false
    }
  })

})()

module.exports = Args
