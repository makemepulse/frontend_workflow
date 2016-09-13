'use strict'

const path = require('path')
const fs   = require('fs')

class Importer {

  constructor() {
    this.load = this.load.bind(this)

    // Defaults
    this.pkg = null

    // Load package.json
    const package_path = path.resolve('package.json')
    if (fs.existsSync( package_path )) {
      this.pkg = require(package_path)
    }
  }

  load(p, root) {
    if (root) {
      p = path.join(root, p)
    }

    p = path.resolve(p)
    if (fs.statSync(p).isFile()) {

      if (p.match(/package\.json/)) {
        this._package(require(p))
      } else {
        this._file(p)
      }

    } else if (fs.statSync(p).isDirectory()) {
      this._directory(p)
    }
  }

  loadNamespace(p, root) {
    if (root) {
      p = path.join(root, p)
    }

    p = path.resolve(p)
    let namespaceName = path.basename(p)
    namespaceName     = namespaceName.split('.').shift()

    const scope = this
    namespace(namespaceName, function() {
      scope.load( p )
    })
  }

  _file(p) {
    jake.loader.loadFile(p)
  }

  _directory(p) {
    jake.loader.loadDirectory(p)
  }

  _package(pkg) {

    const scripts = pkg.scripts || {}

    for (const key in scripts) {

      const parts = key.split(':')
      const name  = parts.pop()

      const createNS = function(parts) {
        const ns = parts.shift()
        namespace(ns, function() {
          if (parts.length > 0) {
            createNS(parts)
          } else {
            desc('[npm] ' + scripts[key])
            command(name, scripts[key])
          }
        })
      }

      if (parts.length) createNS(parts.slice(0))
      else command(name, scripts[key])

    }
  }

}

module.exports = new Importer