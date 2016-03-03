#!/usr/bin/env node
'use strict';

const bs    = require('browser-sync')
const Print = require('./../lib/Print')

const Server = function(options) {

  bs.create()
  bs.init(options.config)

  const pattern = options.config.files
  const params  = options.config.options

  const watcher = bs.watch(pattern, params)
  return watcher

}

module.exports = Server
