'use strict'

/**
 * Workflow implementation from jake.js
 * https://github.com/jakejs/jake/blob/master/lib/jake.js
 */

global.wk = {}

const Namespace   = require('./namespace')
const API         = require('./api')
const Print       = require('./print')
const Importer    = require('./importer')
const TaskManager = require('./task-manager')
const PATHS       = require('./config/paths')
const Command     = require('./command')

// Method to export
wk.Print              = Print
wk.defaultNamespace   = new Namespace('default', null)
wk.currentNamespace   = wk.defaultNamespace
wk.currentDescription = null

wk.load = Importer.load
wk.run  = TaskManager.run

// Check no global property overrided
const API_KEYS = Object.keys(API)

for (const i in API_KEYS) {
  if (global.hasOwnProperty(API_KEYS[i])) {
   throw new Error(`The api method ${API_KEYS[i]} override a global property`)
  }
}

// Export API to global
Object.assign(global, API)

// Execute startup tasks
try {
  wk.load('Wkfile')
} catch(e) {
  throw new Error('No Wkfile found')
}

Command()