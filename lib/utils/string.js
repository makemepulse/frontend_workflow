'use strict'

const _pad = function(value, max, character, after) {
  if (value === undefined) return
  const s = value.toString();
  return s.length < max ? _pad(!!after ? value+character : character+value, max, character, after) : s
}

module.exports = {
  pad: _pad
}