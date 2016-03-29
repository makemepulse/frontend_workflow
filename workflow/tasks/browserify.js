#!/usr/bin/env node
'use strict'

const fs         = require('fs-extra')
const path       = require('path')
const browserify = require('browserify')
const watchify   = require('watchify')
const partialify = require('partialify/custom')
const babelify   = require('babelify')

const Print      = require('./../lib/Print')


const Browserify = function(params) {

  // Configure
  const config             = params.config
  const browserify_options = config.options
  const input              = params.input
  const output             = params.output
  const tmp_output         = `${__dirname}/../tmp/${path.basename(params.output)}`

  browserify_options.debug              = params.sourcemaps
  config.transforms.babelify.sourceMaps = params.sourcemaps ? 'inline' : false

  // Check tmp_output directory exists
  fs.ensureDirSync(path.dirname(tmp_output))

  // Functions
  const bundle = function() {
    var bndle = b.bundle();
    bndle     = bndle.on('error', onError);

    if (tmp_output) {
      bndle.pipe(fs.createWriteStream(tmp_output));
    } else {
      bndle.pipe(process.stdout);
    }
  }

  const onLabel = function(e) {
    const i = input.replace('./', '');
    if (e.match(i)) {
      fs.move(tmp_output, output, { clobber: true }, function() {
        Print.log(`[Browserify] Compiled ${output}`, true, 'magenta')
      })
    }
  }

  const onError = function() {
    Print.log('[Browserify] Error', true, 'red')
    Print.log(err.message, true, 'red');
  }

  const onLog = function(msg) {
    Print.log('[Watchify] '+msg, true, 'white')
  }

  const onExit = function() {
    b.close()
  }

  const onUpdate = bundle

  // Configure Browserify
  var b = browserify(input, browserify_options)
  b.on('label', onLabel)

  // Configure Watchify
  if (params.watch) {
    b = watchify(b, config.transforms.watchify)
    b.on('update', onUpdate)
    b.on('log', onLog)
  }

  // Configure transforms
  if (config.transforms.babelify) b.transform(babelify, config.transforms.babelify);
  if (config.transforms.partialify) b.transform(partialify.alsoAllow(config.transforms.partialify));

  // Listen exit event
  process.on('beforeExit', onExit)

  // Start bundle
  bundle()
}

module.exports = Browserify
