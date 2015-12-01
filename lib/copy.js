#!/usr/bin/env node
'use strict'

const fs = require('fs-extra')
const Print = require('./print')

const Copy = function(options) {

  const string = [
    options.o,
    "node_modules",
    ".git",
    ".gitignore",
    ".npmignore"
  ].join('|')
  const regex = new RegExp(`(${string})$`)

  let exists = false
  let stat   = null

  try {
    stat = fs.lstatSync(options.o)
    exists = true
  } catch(e) {}

  if (!exists) {
    fs.copy(__dirname + '/../', options.o, {
      clobber: false,
      filter: function(file) {
        if (file.match(regex)) return false
        return true
      }
    }, function(err) {
      if (!err) Print.log(`Symbolic link to '${options.o}' created`, true, 'green')
      else Print.log(err, false, 'red')
    })
  } else {
    if (stat && !stat.isDirectory()) {
      Print.log(`'${options.o}' exists, but it is not a symbolic link`)
    } else {
      Print.log(`Symbolic link to '${options.o}' already exists`, true, 'yellow')
    }
  }

}

module.exports = Copy
