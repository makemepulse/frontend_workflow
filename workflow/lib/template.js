#!/usr/bin/env node
'use strict'

const fs = require('fs-extra')
const m = require('mustache')
const path = require('path')
const Print = require('./print')

const Template = (function(){

  const _regex = {
    html: /html/i,
    js: /(js|es)/i,
    stylus: /(styl|stylus)/i,
    sass: /(sass)/i
  }

  const _templatePath = [
    __dirname, '..', 'templates'
  ].join('/')

  const _create = function(options) {

    let config   = options.config
    const templateName = options._[0] === 'template' ? options._[1] : options._[0]

    if (!config[templateName]) {
      Print.log(`The "${templateName}" template do not have any configuration`, true, 'yellow')
      return
    }

    config = config[templateName]
    const templatePaths = []

    for (let file, output, pth, i = 0; i < config.files.length; i++) {
      file = config.files[i]

      if (path.dirname(file) === '.') {
        for (let key in _regex) {
          if (file.match(_regex[key])) {
            if (path.extname(file).length > 0) {
              pth = [_templatePath, key, file]
            } else {
              pth = [_templatePath, key, templateName + '.' + file]
            }
            break
          }
        }
      } else {
        pth = [_templatePath, file]
      }

      pth = pth.join('/')
      output = config.output ? config.output + path.extname(pth) : templateName + path.extname(pth)
      templatePaths.push({
        inputFile: pth,
        outputFile: output
      })
    }

    let params = { name: options._[0] === 'template' ? options._[2] : options._[1] }
    if (typeof params.name === 'object') params = params.name

    for (let j = 0; j < templatePaths.length; j++) {
      const template = fs.readFileSync(templatePaths[j].inputFile).toString('utf8')
      const output   = m.render(template, params)
      fs.ensureDirSync(`${config.destination_path}/${params.name}`)
      fs.writeFile(`${config.destination_path}/${params.name}/${templatePaths[j].outputFile}`, output)
      Print.log(`${config.destination_path}/${params.name}/${templatePaths[j].outputFile} generated`, true, 'green')
    }
  }

  return {
    create: _create
  }

})()

module.exports = Template
