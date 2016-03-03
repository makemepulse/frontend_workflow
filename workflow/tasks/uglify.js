#!/usr/bin/env node
'use strict';

const exec = require('child_process').exec;
const Print = require('./../lib/Print')

const Uglify = function(options) {
  const input  = options.i;
  const output = options.o;

  const cmd    = __dirname + '/../node_modules/.bin/uglifyjs';
  const params = [];

  params.push(cmd)
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
    Print.log(`[Uglify] ${data}`, true, 'red')
  });

  cli.on('close', function(code){
    Print.log(`[Uglify] child process exited with code ${code}`, true, 'magenta')
  });
}

module.exports = Uglify
