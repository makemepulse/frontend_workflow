#!/usr/bin/env node
'use strict'

const exec = require('child_process').exec;
const fs    = require('fs-extra')
const Print = require('./print')
const conf  = require('./config.js')

const Setup = (function(options) {

  const _run = function(options) {

    options.name = options.name || options._[1]
    options.name = options.name || 'frontend_workflow'

    _copy(options)
    _copyConfig(options)
  }

  const _copy = function(options) {

    const dir = `${options.o}/${options.name}`

    const string = [
      dir,
      "node_modules",
      ".git",
      ".gitignore",
      ".npmignore",
      "config.yml"
    ].join('|')
    const regex = new RegExp(`(${string})$`)

    let exists = false
    let stat   = null

    try {
      stat = fs.lstatSync(dir)
      exists = true
    } catch(e) {}

    if (!exists) {
      fs.copy(__dirname + '/../', dir, {
        clobber: false,
        filter: function(file) {
          if (file.match(regex)) return false
          return true
        }
      }, function(err) {
        if (!err) {
          Print.log(`'${dir}' directory created`, true, 'green')
          _install(options)
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

  const _copyConfig = function(options) {

    const file = `${options.o}/${options.name}.yml`

    let exists = false
    let stat   = null

    try {
      stat   = fs.statSync(file)
      exists = true
    } catch(e) {}

    if (!exists) {
      fs.copy(__dirname + '/../config.yml', file, function(err){
        if (!err) Print.log(`'${file}' created`, true, 'green')
        else Print.log(err, false, 'red')
      })
    } else {
      if (stat && !stat.isFile()) {
        Print.log(`'${options.o}' path exists, but it is not a file`)
      } else {
        Print.log(`'${options.o}' file already exists`, true, 'yellow')
      }
    }

  }

  const _install = function(options) {

    let cli = exec(`cd ${options.o}/${options.name} && npm install`, function(error, stdout, stderr) {
      Print.log(stdout, false, 'green');
      if (error !== null) {
        Print.log(stderr, false, 'red');
        Print.log('exec error: ' + error, false, 'red');
      }
    })

    cli.stdout.setEncoding('utf8');

    cli.stdout.on('data', function(data) {
      var data = Print.clean(data.toString('utf-8'))
      Print.log(`[Setup] ${data}`, true, 'magenta')
    });

    cli.stderr.on('data', function(data) {
      var data = Print.clean(data.toString('utf-8'))
      Print.log(`[Setup] ${data}`, true, 'red')
    });

    cli.on('close', function(code){
      Print.log(`[Setup] child process exited with code ${code}`, true, 'magenta')
    });
  }

  return {
    install: _install,
    copy: _copy,
    run: _run
  }

})()

module.exports = Setup
