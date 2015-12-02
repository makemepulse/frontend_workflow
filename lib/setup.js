#!/usr/bin/env node
'use strict'

const spawn = require('child_process').spawn
const fs    = require('fs-extra')
const path  = require('path')
const Print = require('./print')

const Setup = (function(options) {

  let _path    = null
  let _options = null

  const _run = function(options) {
    _prepare(options)
    _copy(_install)
  }

  const _prepare = function(options) {
    _options = options
    _path    = path.normalize(process.cwd() + '/' + options.path)
  }

  const _copy = function(callback) {

    const dir    = `${_path}`
    const filter = [
      dir,
      "node_modules",
      ".git",
      ".gitignore",
      ".npmignore"
    ].join('|')
    const regexFilter = new RegExp(`(${filter})$`)

    let exists = false
    let stat   = null

    try {
      stat = fs.lstatSync(dir)
      exists = true
    } catch(e) {}

    if (!exists) {
      fs.copy(__dirname + '/../workflow', dir, {
        clobber: false,
        filter: function(file) {
          if (file.match(regexFilter)) return false
          return true
        }
      }, function(err) {
        if (!err) {
          Print.log(`'${dir}' directory created`, true, 'green')
          if (callback) callback()
        }
        else Print.log(err, false, 'red')
      })
    } else {
      if (stat && !stat.isDirectory()) {
        Print.log(`'${dir}' path exists, but it is not a directory`)
      } else {
        Print.log(`'${dir}' directory already exists`, true, 'yellow')
      }
    }

  }

  const _install = function() {
    let cli = spawn('npm', ['install'], { stdio:'inherit', cwd: `${_path}` })
    cli.on('close', function() { _commandList() })
  }

  const _commandList = function(options) {
    if (options) _prepare(options)

    Print.log("Command availables", true, 'green')
    Print.log(`
      $(npm bin)/workflow stylus -s           // Stylus: Compile with sourcemaps
      $(npm bin)/workflow stylus -s -w        // Stylus: Compile with sourcemaps and watch
      $(npm bin)/workflow stylus -m           // Stylus: Compile and minify

      $(npm bin)/workflow browserify -s       // Browserify: Compile with sourcemaps
      $(npm bin)/workflow browserify -s -w    // Browserify: Compile with sourcemaps and watch
      $(npm bin)/workflow browserify -m       // Browserify: Compile and minify

      $(npm bin)/workflow watcher             // Watcher: Watch files

      $(npm bin)/workflow uglify              // Uglify: Minify more efficiently javascript files
    `, false, 'grey')

    Print.log("You can put these lines inside your package.json", true, 'green')
    Print.log(`
      "scripts": {
        "stylus:compile": "$(npm bin)/workflow stylus -s"
        "stylus:watch": "$(npm bin)/workflow stylus -s -w"
        "stylus:build": "$(npm bin)/workflow stylus -m"
        "browserify:compile": "$(npm bin)/workflow browserify -s"
        "browserify:watch": "$(npm bin)/workflow browserify -s -w"
        "browserify:build": "$(npm bin)/workflow browserify -m"
        "watcher": "$(npm bin)/workflow watcher"
        "uglify": "$(npm bin)/workflow uglify"
        "compile": "npm run stylus:compile & npm run browserify:compile",
        "watch": "npm run stylus:watch & npm run browserify:watch & npm run watcher",
        "build": "npm run stylus:build & npm run browserify:build && npm run uglify"
      }
    `, false, 'grey')

  }

  return {
    commandList: _commandList,
    install: _install,
    run: _run
  }

})()

module.exports = Setup
