'use strict'

/**
 * Workflow implementation from jake.js
 * https://github.com/jakejs/jake/blob/master/lib/jake.js
 */

global.wk = {}

wk.Namespace      = require('./namespace')
wk.ProcessManager = require('./process-manager')
wk.TaskManager    = require('./task-manager')
wk.Task           = require('./task')
wk.api            = require('./api')
wk.guid           = require('./utils/guid').guid

// Defaults
wk.defaultNamespace   = new wk.Namespace('default', null)
wk.currentNamespace   = wk.defaultNamespace
wk.currentDescription = null

// Check override

const API_KEYS = Object.keys(wk.api)

for (let i in API_KEYS) {
  if (global.hasOwnProperty(API_KEYS[i])) {
   throw new Error(`The api method ${API_KEYS[i]} override a global property`)
  }
}

// Export to global
Object.assign(global, wk)
Object.assign(global, wk.api)
