'use strict'

const fs   = require('fs')
const path = require('path')

class Importer {

  constructor() {

    // Binds
    this.import = this.import.bind(this)

    // Defaults
    this.pkg = null

    // Load package.json
    const package_path = path.resolve('package.json')
    if (fs.existsSync( package_path )) {
      this.pkg = require(package_path)
    }
  }

  import(p, root) {

    if (root) {
      p = path.join(root, p)
    }

    p = path.resolve(p)
    if (fs.statSync(p).isFile()) {

      const fileExport = this._file(p)
      if (p.match(/package\.json/)) {
        this._package(fileExport)
      }

    } else if (fs.statSync(p).isDirectory()) {
      this._directory(p)
    }
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
            command(name, scripts[key])
          }
        })
      }

      if (parts.length) createNS(parts.slice(0))
      else command(name, scripts[key])
    }
  }

  _file(p) {
    return require(p)
  }

  _directory(p) {
    const files = fs.readdirSync(p).filter(function(file) {
      return file.match(/\.(js|wk|Wkfile)$/)
    })

    for (const i in files) {
      this._file(`${p}/${files[i]}`)
    }
  }

}

module.exports = new Importer