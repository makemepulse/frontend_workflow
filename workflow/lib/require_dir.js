#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const RequireDir = function(dir, absolute) {
  if (typeof absolute === 'undefined') absolute = false
  if (!absolute) { dir = `${__dirname}/../${dir}` }

  var files  = fs.readdirSync( `${dir}` )
  var result = {}
  for (var pth, i = 0; i < files.length; i++) {
    pth = `${dir}/${files[i]}`
    if (fs.statSync(pth).isFile() && path.extname(pth).match(/\.js$/i)) {
      result[files[i].split('.')[0]] = require(pth)
    }
  }

  return result

}

module.exports = RequireDir
