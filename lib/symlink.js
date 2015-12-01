#!/usr/bin/env node
'use strict'

const fs = require('fs')

const Symlink = function(options) {
  fs.symlinkSync(__dirname + '/../', options.o)
}

module.exports = Symlink
