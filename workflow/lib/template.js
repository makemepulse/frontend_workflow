#!/usr/bin/env node
'use strict'

const fs = require('fs-extra')
const m = require('mustache')

const Template = (function(){

  const _templatePath = [
    __dirname, '..', 'templates'
  ]

  const _create = function(options) {
    // node index.js -i stylus/section.styl -o _tmp --params [ --name "main" ]

    let templatePath = options.templatePath || _templatePath.join('/')
    let input =  `${templatePath}/${options.i}`
    let template = fs.readFileSync(input).toString('utf8')
    let result   = m.render(template, options.params)

    fs.ensureDirSync(options.o)
    fs.writeFile(`${options.o}/${options.params.name}.${options.i.split('.')[1]}`, result)
  }

  return {
    create: _create
  }

})()

module.exports = Template
