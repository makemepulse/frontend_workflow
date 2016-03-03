#!/usr/bin/env node
'use strict';

const Print   = require('./../lib/Print')
const exec    = require('child_process').exec
const extname = require('path').extname
const fs      = require('fs')

const Stylus = function(options) {

  const input  = options.i;
  let output = options.o;

  let outputExtname = extname(output)
  if (outputExtname !== '.css') {
    output = output.replace(outputExtname, '')
  } else {
    outputExtname = null
  }

  var applyExtname = function() {
    if (outputExtname) {
      try {
        fs.renameSync(output, output+outputExtname)
      } catch(e) {}
    }
  }

  const cmd    = `${__dirname}/../../node_modules/.bin/stylus`;
  const params = [cmd];

  if (options.sourcemaps) { params.push("--sourcemap-inline"); }
  if (options.watch)      { params.push("--watch"); }
  if (options.compress)   { params.push("--compress"); }
  params.push("--include-css");
  params.push("--use");
  params.push(`${__dirname}/../../node_modules/autoprefixer-stylus`);
  // params.push(`--with`);
  // params.push(`"{ browsers: ['ie 7', 'ie 8', 'ie 9', 'ie 10', 'ie 11'] }"`);
  params.push("--use");
  params.push(`${__dirname}/../../node_modules/rupture`);
  params.push(input);
  params.push("--out");
  params.push(output);

  const cli = exec(params.join(' '))

  cli.stdout.setEncoding('utf-8')
  cli.stdout.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[Stylus] ${data}`, true, 'magenta')
    applyExtname()
  });

  cli.stderr.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[Stylus] ${data}`, true, 'red')
  });

  cli.on('close', function(code){
    Print.log(`[Stylus] child process exited with code ${code}`, true, 'magenta')
    applyExtname()
  });

}

module.exports = Stylus
