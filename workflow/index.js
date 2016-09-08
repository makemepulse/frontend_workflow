#!/usr/bin/env node

'use strict'

const ARGParser  = require('./lib/arg-parser')
ARGParser.config = require('./config/parameters')
const parameters = ARGParser.parse(process.argv.slice(2))


// Get package.json scripts
const fs   = require('fs');
const path = require('path');

let SCRIPTS        = {}
let packageJSON    = {}
const package_path = path.resolve('package.json');

if (fs.existsSync( package_path )) {
  packageJSON = require(package_path)
  SCRIPTS = packageJSON.scripts || {}
}

// Register package.json scripts
const TaskManager = require('./lib/task-manager')

for (const key in SCRIPTS) {
  TaskManager.register(key, SCRIPTS[key])
}

// Generate tasks for non-scripts from parameters
const TASKS = parameters._._;

for (const i in TASKS) {
  if (!TaskManager.tasks[TASKS[i]]) {
    TASKS[i] = TaskManager.registerCommand(TASKS[i])
  }
}

if (typeof TaskManager[parameters.sequence] === 'function') {
  TaskManager[parameters.sequence](parameters._._)
}