'use strict'

const chalk = require('chalk')

module.exports = function(str, color) {
  return `${chalk.styles[color].open}${str}${chalk.styles[color].close}`
}

module.exports.chalk = chalk

for (const key in chalk.styles) {
  module.exports[key] = function() {
    const str = [...arguments].join(' ')
    return `${chalk.styles[key].open}${str}${chalk.styles[key].close}`
  }
}

