#!/usr/bin/env node
'use strict';

const path        = require('path')
const fs          = require('fs')
const TaskProcess = require('../lib/TaskProcess')
const paths       = require('../config/paths')

const STYLUS_CLI        = path.join(path.dirname(require.resolve('stylus')), 'bin', 'stylus')
const RUPTURE_PATH      = path.dirname(require.resolve('rupture'))
const AUTOPREFIXER_PATH = path.dirname(require.resolve('autoprefixer-stylus'))

class Stylus extends TaskProcess {

  execute() {
    const params = this.getParameters()
    const config = this.getConfig()

    const input = params.input
    let output  = params.output

    /**
     * Handle output with an extension different of ".css"
     */
    let outputExtname = path.extname(output)
    if (outputExtname !== '.css') {
      output = output.replace(outputExtname, '')
    } else {
      outputExtname = null
    }

    const applyExtname = function() {
      if (outputExtname) {
        try {
          fs.renameSync(output, output+outputExtname)
        } catch(e) {}
      }
    }

    /**
     * Configuration
     */
    const command = [STYLUS_CLI];
    if (params.sourcemaps) { command.push("--sourcemap-inline"); }
    if (params.watch)      { command.push("--watch"); }
    if (params.compress)   { command.push("--compress"); }

    // Allow css file import
    command.push("--include-css");

    // import autoprefixer
    if (config.autoprefixer) {
      command.push("--use");
      command.push(AUTOPREFIXER_PATH);
      command.push(`--with`);
      command.push(`'${JSON.stringify(config.autoprefixer)}'`);
    }

    // import rupture
    command.push("--use");
    command.push(RUPTURE_PATH);

    // Set input/output
    command.push(input);
    command.push("--out");
    command.push(output);

    const ps = super.execute(command.join(' '))
    ps.stdout.on('data', applyExtname)
    ps.on('close', applyExtname)
  }

}

Stylus.description = `Stylus is a revolutionary new language, providing an efficient, dynamic, and expressive way to generate CSS. Supporting both an indented syntax and regular CSS style.
Compile '.styl' to '.css'`

module.exports = Stylus
