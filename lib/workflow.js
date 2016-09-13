'use strict'

const api      = require('./api')
const Importer = require('./importer')

jake.load          = Importer.load
jake.loadNamespace = Importer.loadNamespace
jake.mixin(global, api)

// Import scripts from package.json
jake.load('package.json')