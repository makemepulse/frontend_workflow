const EventEmitter = require('events').EventEmitter
const NaL          = require('now-and-later')
const _            = require('./lib/functions/object')

const _tasks       = {}

class Task extends EventEmitter {
  constructor(name, parameters) {
    super()

    this.parameters = parameters ? _.clone(parameters) : {}
    this._name      = name || 'noname'
    this.running    = false
  }

  execute() {
    console.log(this._name)
  }

}

Task.register = function(name, fnOrArray) {

  if (_tasks.hasOwnProperty(name)) return


  let tasks      = null
  let parameters = {}
  if (typeof fnOrArray === 'function') {
    parameters = fnOrArray() || parameters
  } else if (Array.isArray(fnOrArray)) {
    tasks = fnOrArray
  }

  if (!tasks) {
    _tasks[name] = new Task(name, parameters)
    return
  }

  _tasks[name] = tasks

}

Task.register('task0', function() {
  return {}
})

Task.register('task1', function() {
  return {}
})

Task.register('task2', function() {
  return {}
})

Task.register('task3', ['task0', 'task1'])
Task.register('task4', [['task0', 'task2'], 'task1'])



Task._getTasks = function(names) {

  if (!Array.isArray(names)) {
    return _tasks[names]
  }

  let tmp = []

  for (let i = 0, value, value1, len = names.length; i < len; i++) {

    if (Array.isArray(names[i])) {
      value = Task._getTasks(names[i])
    } else {
      value = _tasks[names[i]]
    }

    if (!value) continue

    value1 = this._getTasks(value)
    if (value1) value = value1

    tmp.push(value)

  }



  const flatten = function(arr, iteration, max) {

    const tp = []

    if (iteration === max) {
      return [].concat.apply([], arr)
    }

    for (let j = 0, ln = arr.length; j < ln; j++) {
      if (Array.isArray(arr[j])) {
        arr[j] = flatten(arr[j], iteration+1, max)
      }

      tp[j] = arr[j]
    }

    return tp

  }

  tmp = flatten(tmp, 0, 1)

  if (tmp.length === 1) return tmp[0]
  if (tmp.length >   0) return tmp

}

Task.execute = function() {
  let names    = [...arguments]
  let callback = function() {}

  if (typeof names[names.length-1] === 'function') {
    callback = names[names.length-1]
    names    = names.slice(0, names.length-1)
  }

  const tasks = Task._getTasks( names )

  const seriesIterator = function(task, cb) {
    if (Array.isArray(task)) {
      console.log('-------------- PARALLEL')
      NaL.map( task, parallelIterator )
      cb()
    } else {
      console.log('-------------- SERIE')
      parallelIterator( task, cb )
    }
  }

  const parallelIterator = function(task, cb) {
    if (task && task.execute) task.execute()
    cb()
  }

  NaL.mapSeries(tasks, seriesIterator, callback)
}

Task.execute( 'task0', 'task1', 'task2', 'task3', 'task4', function() {
  console.dir('Executed with success')
})