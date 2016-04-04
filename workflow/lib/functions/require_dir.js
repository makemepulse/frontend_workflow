'use strict'

const requireDir = function(dir) {

  const fs    = require('fs')
  const path  = require('path')
  const paths = require('paths')

//  if (typeof absolute === 'undefined') absolute = false
//  if (!absolute) { dir = `${paths.workflow_path}/${dir}` }//dir = `${__dirname}/../${dir}` }

  if (!path.isAbsolute(dir)) { dir = `${paths.workflow_path}/${dir}` }

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

module.exports = requireDir
