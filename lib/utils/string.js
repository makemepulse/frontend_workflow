'use strict'

const _pad = function(value, max) {
  if (value === undefined) return
  const s = value.toString();
  return s.length < max ? _pad("0"+value, max) : s
}

module.exports = {
  pad: _pad
}