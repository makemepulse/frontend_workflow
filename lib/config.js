#!/usr/bin/env node
'use strict'

const fs = require('fs')
const m = require('mustache')
const yaml = require('js-yaml')

const Config = (function(){

  let content = fs.readFileSync(`${__dirname}/../config.yml`).toString('utf-8')
  let object  = yaml.load(content)
  content     = m.render(content, object)
  object      = yaml.load(content)

  return object

})()

module.exports = Config
