#!/usr/bin/env node
'use strict';

const Print  = require('./../lib/Print')

const Uglify = function(options) {
  let input  = options.i;
  let output = options.o;

  let cmd    = __dirname + '/../node_modules/.bin/uglifyjs';
  let params = [];

  params.push(__dirname + '/..' + input);
  params.push('-c')
  params.push('--mangle')
  params.push("--output");
  params.push(__dirname + '/..' +output);

  let spawn = require('child_process').spawn;
  let cli   = spawn(cmd, params);

  cli.stdout.on('data', function(data) {
    var data = Print.clean(data.toString('utf-8'))
    Print.log(`[Uglify] ${data}`, true, 'magenta')
  });

  cli.stderr.on('data', function(data) {
    var data = Print.clean(data.toString('utf-8'))
    Print.log(`[Uglify] ${data}`, true, 'red')
  });

  cli.on('close', function(code){
    Print.log(`[Uglify] child process exited with code ${code}`, true, 'magenta')
  });
}

module.exports = Uglify
