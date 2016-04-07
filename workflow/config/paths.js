'use strict'

/**
 * List of paths
 */

module.exports = (function() {
  const path = require('path')
  const fs   = require('fs-extra')

  const paths = {
    workflow_path:  path.join(__dirname, '..'),
    tasks_path:     path.join(__dirname, '..', 'tasks'),
    templates_path: path.join(__dirname, '..', 'templates'),
    tmp_path:       path.join(__dirname, '..', 'tmp'),
    pids_path:      path.join(__dirname, '..', 'tmp', 'pids'),
    lib_path:       path.join(__dirname),
  }

  // Create directories from paths
  for (let k in paths) {
    fs.ensureDirSync(paths[k])
  }

  return paths

})()
