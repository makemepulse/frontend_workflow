'use strict'

const parameters     = require('./../config/parameters')
const pad            = require('./../utils/string').pad
const ProcessManager = require('./../process-manager')

namespace('wk', function() {

  task('help', function() {
    const p = []
    let str = null, param = null
    for (const key in parameters) {

      param = parameters[key]
      str = ''

      if (!param.aliases) {
        param.aliases = [ key ]
      } else {
        param.aliases.unshift( key )
      }

      for (const i in param.aliases) {
        if (param.aliases[i].length === 1) {
          str += ' -' + param.aliases[i]
        } else {
          str += ' --' + param.aliases[i]
        }
      }

      str = '  ' + pad(str, 25, ' ', true)
      str = str + ' ' + (param.description || '-') + '\n'

      p.push( str )
    }


    console.log( 'List of arguments:\n' )
    console.log( p.join('\n')  )

  })

  task('clean', function() {
    ProcessManager.clean()
  })

})