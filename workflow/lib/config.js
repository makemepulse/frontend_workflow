#!/usr/bin/env node
'use strict'

const fs   = require('fs-extra')
const m    = require('mustache')
const yaml = require('js-yaml')

const Config = function(options){

  let content = fs.readFileSync(`${__dirname}/../config.yml`).toString('utf-8')
  content     = m.render(content, yaml.load(content))
  content     = m.render(content, yaml.load(content))
  return yaml.load(content)

}

module.exports = Config
