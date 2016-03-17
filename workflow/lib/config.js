#!/usr/bin/env node
'use strict'

const fs   = require('fs-extra')
const m    = require('mustache')
const yaml = require('js-yaml')

const Config = function(options){

  let content = fs.readFileSync(`${__dirname}/../config.yml`).toString('utf-8')
  content     = m.render(content, yaml.load(content)) // Render yaml to yaml object
  content     = m.render(content, yaml.load(content)) // Render again with yaml object in parameters
  return yaml.load(content)

}

module.exports = Config
