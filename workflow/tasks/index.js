'use strict'

const path  = require('path')
const paths = require('../config/paths')
const fs = require('fs')

const files  = fs.readdirSync(paths.tasks_path)
const _tasks = []
for (let i = 0, len = files.length; i < len; i++) {
  if (path.extname(files[i]) === '.js' && files[i] !== 'index.js') {
    _tasks.push(files[i].replace('.js', ''))
  }
}

const _isTask = function(task_name) {
  return _tasks.indexOf(task_name) !== -1
}

const _getTask = function(task_name) {
  if (!_isTask(task_name)) return null
  return require(path.join(paths.tasks_path, task_name+'.js'))
}

const _createTask = function(task_name, config) {
  const Task = _getTask(task_name)
  if (!Task) return null
  return Task.create(task_name, config)
}

module.exports = {
  tasks: _tasks,
  isTask: _isTask,
  getTask: _getTask,
  createTask: _createTask
}