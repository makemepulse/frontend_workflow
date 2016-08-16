'use strict'

const Webpack = require('./tasks/webpack')

const task0 = new Webpack('webpack', {
  configPath: './workflow/config/development.js'
})

task0.execute()