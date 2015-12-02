#!/usr/bin/env node
'use strict'

const spawn = require('child_process').spawn
const fs    = require('fs-extra')
const Print = require('./print')

const Setup = (function(options) {

  let _workflow_name = null
  let _workflow_path = null
  let _options       = null

  const _run = function(options) {
    _prepare(options)
    _copy(_install)
  }

  const _prepare = function(options) {
    _options       = options
    _workflow_path = options.workflow_path
    _workflow_name = options.workflow_name
  }

  const _copy = function(callback) {

    const dir    = `${_workflow_path}/${_workflow_name}`
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
    spawn('npm', ['install'], { stdio:'inherit', cwd: `${_workflow_path}/${_workflow_name}` })
  }

  const _commandList = function(options) {
    if (options) _prepare(options)
    let print = []

    print.push(`"stylus:compile": "$(npm bin)/workflow stylus -s"`)        // Stylus: Compile with sourcemaps
    print.push(`"stylus:watch": "$(npm bin)/workflow stylus -s -w"`)       // Stylus: Compile with sourcemaps and watch
    print.push(`"stylus:build": "$(npm bin)/workflow stylus -m"`)          // Stylus: Compile and minify

    print.push(`"browserify:compile": "$(npm bin)/workflow stylus -s"`)    // Browserify: Compile with sourcemaps
    print.push(`"browserify:watch": "$(npm bin)/workflow stylus -s -w"`)   // Browserify: Compile with sourcemaps and watch
    print.push(`"browserify:build": "$(npm bin)/workflow stylus -m"`)      // Browserify: Compile and minify

    print.push(`"watcher": "$(npm bin)/workflow watcher"`)                 // Watcher: Watch files

    print.push(`"uglify": "$(npm bin)/workflow uglify"`)                   // Uglify: Minify more efficiently javascript files

    Print.log("You can print these lines in the script section of your package.json", true, 'green')
    Print.log(print.join(',\n'), false, 'grey')
  }

  return {
    commandList: _commandList,
    install: _install,
    run: _run
  }

})()

module.exports = Setup
