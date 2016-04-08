'use strict'

const path        = require('path')
const packageJSON = require('../../package.json')
let config        = require('../config/tasks')


/**
 * Use config file written inside package.json
 *
 * Inside package.json, you can precise a different config file per environment
 * eg.:
 *
 *    "workflow": {
 *      "production": "./workflow/production.js"
 *      "development": "./workflow/development.js"
 *    }
 *
 * To precise an environment :
 *
 *    "workflow": {
 *      "env": "production"
 *    }
 *
 *    OR
 *
 *    NODE_ENV=production node workflow browserify
 *
 * The environment by default is `development`
 *
 */
if (packageJSON.workflow) {
  const w   = packageJSON.workflow
  const ENV = w['env'] || process.env.NODE_ENV || 'development'

  if (w[ENV])           config = require(path.resolve(w[ENV]))
  else if (w['config']) config = require(path.resolve(w['config']))
}

module.exports = config
