#!/usr/bin/env node
'use strict'

const fs   = require('fs-extra')
const m    = require('mustache')
const yaml = require('js-yaml')

const Config = function(configPath){

  const path = configPath ? configPath : `${__dirname}/../config.yml`

  let content = fs.readFileSync(path).toString('utf-8')
  content     = m.render(content, yaml.load(content)) // Render yaml to an object
  content     = m.render(content, yaml.load(content)) // Render again with the object

  return yaml.load(content)

}

module.exports = Config
