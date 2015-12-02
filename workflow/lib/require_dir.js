#!/usr/bin/env node
'use strict'

const fs = require('fs')

const RequireDir = function(dir) {

  var dir    = `${__dirname}/../${dir}` 
  var files  = fs.readdirSync( `${dir}` )
  var result = {}
  for (var i = 0; i < files.length; i++) {
    if (fs.statSync(`${dir}/${files[i]}`).isFile()) {
      result[files[i].split('.')[0]] = require(`${dir}/${files[i]}`)
    }
  }

  return result

}

module.exports = RequireDir
