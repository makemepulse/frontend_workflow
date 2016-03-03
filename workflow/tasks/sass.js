#!/usr/bin/env node
'use strict';

const Print   = require('./../lib/Print')
const exec    = require('child_process').exec
const fs      = require('fs')

const SASS = function(options) {

  const input  = options.i;
  const output = options.o;

  var params = ['sass'];
  if (options.compass) {
    params = ['compass'];
  } else {
    params.push('-r');
    params.push('bourbon');
  }

  if (options.sourcemaps) {
    params.push("--sourcemap=inline");
  }
  if (!options.sourcemaps) {
    params.push("--sourcemap=none");
  }
  if (options.watch) {
    params.push("--watch");
  }
  if (options.compress) {
    params.push("--style");
    params.push("compressed");
  }
  if (options.scss) {
    params.push("--scss");
  }
  params.push(input + ':' + output);

  const cli = exec(params.join(' '))

  cli.stdout.setEncoding('utf-8')
  cli.stdout.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[SASS] ${data}`, true, 'magenta')
  });

  cli.stderr.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[SASS] ${data}`, true, 'red')
  });

  cli.on('close', function(code){
    Print.log(`[SASS] child process exited with code ${code}`, true, 'magenta')
  });

}

module.exports = SASS
