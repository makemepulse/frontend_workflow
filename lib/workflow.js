'use strict'

/**
 * Workflow implementation from jake.js
 * https://github.com/jakejs/jake/blob/master/lib/jake.js
 */

global.wk = {}

wk.Namespace      = require('./namespace')
wk.Print          = require('./print')
wk.ProcessManager = require('./process-manager')
wk.TaskManager    = require('./task-manager')
wk.Task           = require('./task')
wk.api            = require('./api')
wk.guid           = require('./utils/guid').guid
wk.load           = require('./importer').import

// Defaults
wk.defaultNamespace   = new wk.Namespace('default', null)
wk.currentNamespace   = wk.defaultNamespace
wk.currentDescription = null

// Check no global property overrided
const API_KEYS = Object.keys(wk.api)

for (const i in API_KEYS) {
  if (global.hasOwnProperty(API_KEYS[i])) {
   throw new Error(`The api method ${API_KEYS[i]} override a global property`)
  }
}

// Export to global
Object.assign(global, wk.api)
