'use strict'

const merge = function() {
  return Object.assign( ...arguments )
}

const clone = function( a ) {
  return JSON.parse(JSON.stringify(a))
}

const extend = function( a, b ) {
  return merge( clone(a), b )
}

module.exports = {
  merge: merge,
  clone: clone,
  extend: extend
}
