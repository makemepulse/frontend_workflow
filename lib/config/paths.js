'use strict'

/**
 * List of paths
 */

module.exports = (function() {
  const path = require('path')
  const fs   = require('fs-extra')

  const paths = {
    lib_path:  path.join(__dirname, '..'),
    tmp_path:  path.join(process.cwd(), 'tmp'),
    pids_path: path.join(process.cwd(), 'tmp', 'pids')
  }

  // Create directories from paths
  for (let k in paths) {
    fs.ensureDirSync(paths[k])
  }

  return paths

})()
