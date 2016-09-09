'use strict'

const fs          = require('fs')
const path        = require('path')
const TaskManager = require('./../lib/task-manager')

// Get package.json scripts
let TASKS          = {}
let packageJSON    = {}
const package_path = path.resolve('package.json')

if (fs.existsSync( package_path )) {
  packageJSON = require(package_path)
  TASKS       = packageJSON.scripts || {}
}

// Register package.json scripts
for (const key in TASKS) {
  TaskManager.register(key, TASKS[key])
}

module.exports = TASKS