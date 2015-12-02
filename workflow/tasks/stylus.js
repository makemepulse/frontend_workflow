#!/usr/bin/env node
'use strict';

const Print = require('./../lib/Print')
const exec  = require('child_process').exec;

const Stylus = function(options) {

  var input  = options.i;
  var output = options.o;

  var cmd    = `${__dirname}/../node_modules/.bin/stylus`;
  var params = [cmd];

  if (options.sourcemaps) { params.push("--sourcemap-inline"); }
  if (options.watch)      { params.push("--watch"); }
  if (options.compress)   { params.push("--compress"); }
  params.push("--include-css");
  params.push("--use");
  params.push(`${__dirname}/../node_modules/autoprefixer-stylus`);
  params.push("--use");
  params.push(`${__dirname}/../node_modules/rupture`);

  params.push("<");
  params.push(input);
  params.push(">");
  params.push(output);

  var cli = exec(params.join(' '))

  cli.stdout.setEncoding('utf-8')
  cli.stdout.on('data', function(data) {
    var data = Print.clean(data.toString('utf-8'))
    Print.log(`[Stylus] ${data}`, true, 'magenta')
  });

  cli.stderr.on('data', function(data) {
    var data = Print.clean(data.toString('utf-8'))
    Print.log(`[Stylus] ${data}`, true, 'red')
  });

  cli.on('close', function(code){
    Print.log(`[Stylus] child process exited with code ${code}`, true, 'magenta')
  });

}

module.exports = Stylus
