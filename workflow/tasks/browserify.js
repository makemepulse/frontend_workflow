#!/usr/bin/env node
'use strict'

const fs         = require('fs')
const browserify = require('browserify')
const watchify   = require('watchify')
const aliasify   = require('aliasify')
const partialify = require('partialify/custom')
const babelify   = require('babelify')

const Print      = require('./../lib/Print')

const Browserify = function(options) {

  const config = options.config;
  const input  = options.i;
  const output = options.o;

  config.options.debug   = options.sourcemaps;
  config.options.entries = [input];
  config.options.paths   = [__dirname + '/../app'];

  config.babelify.compact  = options.compress;
  config.babelify.comments = !options.compress;

  /**
   * Configure browserify
   */
  var b = browserify(config.options);
  b.on('bundle', onBundle);
  b.on('label', function(e){
    const i = input.replace('./', '');
    if (e.match(i)) {
      Print.log(`[Browserify] Compiled ${output}`, true, 'magenta')
    }
  });

  if (options.watch) {
    b = watchify(b);
    b.on('update', onUpdate);
  }

  /**
   * Add transforms
   */
  b.transform(babelify, config.babelify);
  b.transform(aliasify, config.aliasify);
  b.transform(partialify.alsoAllow(config.partialify.extensions));

  function bundle(){
    var bndle = b.bundle();
    bndle     = bndle.on('error', onError);

    if (output) {
      bndle.pipe(fs.createWriteStream(output));
    } else {
      bndle.pipe(process.stdout);
    }
  }

  function onUpdate(){
    var inputDisplay = input.replace(__dirname + '/../', '');
    bundle();
  }

  function onError(err){
    Print.log('[Browserify] Error', true, 'red')
    Print.log(err.message, true, 'red');
  }

  function onBundle(){
    var inputDisplay = input.replace(__dirname + '/../', '');
  }

  bundle();

}

module.exports = Browserify
