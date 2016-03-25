#!/usr/bin/env node
'use strict';

const exec  = require('child_process').exec;
const path  = require('path')
const Print = require('./../lib/Print')

const UGLIFY_CLI = path.dirname(require.resolve('uglifyjs'))+'/../bin/uglifyjs'

const Uglify = function(options) {
  const input  = options.i;
  const output = options.o;

  const params = [UGLIFY_CLI];

  params.push(input);
  params.push('-c')
  params.push('--mangle')
  params.push("--output");
  params.push(output);

  const cli = exec(params.join(' '))

  cli.stdout.setEncoding('utf-8')
  cli.stdout.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[Uglify] ${data}`, true, 'magenta')
  });

  cli.stderr.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[Uglify] ${data}`, true, 'yellow')
  });

  cli.on('close', function(code){
    Print.log(`[Uglify] child process exited with code ${code}`, true, 'magenta')
  });
}

module.exports = Uglify
