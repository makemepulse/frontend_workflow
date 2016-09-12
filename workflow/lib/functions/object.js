'use strict'

const merge = function() {
  return Object.assign( ...arguments )
}

const clone = function( a ) {
  return JSON.parse(JSON.stringify(a))
}

const extend = function() {
  const args = [...arguments]
  const a   = args[0]

  const items = args.map(function(arg) {
    if (arg === a) return a
    return clone(arg)
  })

  return merge(...items)
}

module.exports = {
  merge: merge,
  clone: clone,
  extend: extend
}
