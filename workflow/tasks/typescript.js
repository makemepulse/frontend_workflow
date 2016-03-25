#!/usr/bin/env node
'use strict';

const Print   = require('./../lib/Print')
const exec    = require('child_process').exec
const fs      = require('fs')
const path    = require('path')

const TSC_CLI = path.dirname(require.resolve('typescript'))+'/../bin/tsc'

const Typescript = function(options) {

  const input  = options.i;
  const output = options.o;

  var params = [TSC_CLI, input, '--allowJs']

  if (options.sourcemaps) params.push("--inlineSourceMap")
  if (options.watch) params.push("--watch")
  if (path.extname(output).length === 0) params.push("--outDir "+output)
  else params.push("--out "+output)

  const cli = exec(params.join(' '))

  cli.stdout.setEncoding('utf-8')
  cli.stdout.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[Typescript] ${data}`, true, 'magenta')
  });

  cli.stderr.on('data', function(data) {
    data = Print.clean(data.toString('utf-8'))
    Print.log(`[Typescript] ${data}`, true, 'red')
  });

  cli.on('close', function(code){
    Print.log(`[Typescript] child process exited with code ${code}`, true, 'magenta')
  });

}

module.exports = Typescript
