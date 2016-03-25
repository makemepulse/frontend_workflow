#!/usr/bin/env node
'use strict';

const Print   = require('./../lib/Print')
const exec    = require('child_process').exec
const fs      = require('fs')
const path    = require('path')

const POSTCSS_CLI = path.dirname(require.resolve('postcss-cli'))+'/bin/postcss'

const POSTCSS = function(options) {

  const input  = options.i;
  const output = options.o;

  var params = [POSTCSS_CLI]
  if (options.sourcemaps) params.push("--map");
  if (options.watch) params.push("--watch")

  params.push(`--use ${__dirname}/../../node_modules/autoprefixer`)

  params.push(`--output ${output}`)
  params.push(input)

  const cli = exec(params.join(' '))

  cli.stdout.setEncoding('utf-8')
  cli.stdout.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[POSTCSS] ${data}`, true, 'magenta')
  });

  cli.stderr.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[POSTCSS] ${data}`, true, 'red')
  });

  cli.on('close', function(code){
    Print.log(`[POSTCSS] child process exited with code ${code}`, true, 'magenta')
  });

}

module.exports = POSTCSS
