'use strict'

const path = require('path')

class Parser {

  constructor( config ) {
    this.config    = typeof config === 'object' ? config: null
    this._checkers = {}
  }

  new() {
    const parser = new Parser(...arguments)
    parser._checkers = JSON.parse(JSON.stringify(this._checkers))
    parser.config    = JSON.parse(JSON.stringify(this.config))
    return parser
  }

  checker(name, checkFn) {
    if (!name || !checkFn) {
      console.warn('No name or check function found')
      return
    }

    this._checkers[name] = checkFn
  }

  parse( parameters ) {
    if (!this.config) {
      console.warn('No configuration found')
      return
    }

    const result = {
      _: parameters.slice(0)
    }

    const params = result._.join('=').split('=')

    let param, value
    for (const key in this.config) {
      param = this.config[key]

      if (!param.type) {
        param.type = 'boolean'
      }

      // Get value from key
      value = this._getValue(key, params)

      // Get value from the first argument
      if (value === undefined && param.first_argument) {
        value = this._getFirstArgument(params)
      }

      // Get value from aliases
      if (value === undefined && param.aliases) {
        for (let i = 0, len = param.aliases.length; i < len; i++) {
          value = this._getValue( param.aliases[i], params )
          if (value !== undefined) break
        }
      }

      // Check the value
      if (this._checkers[param.type]) {
        if (!this._checkers[param.type]( param, value )) {
          value = undefined
        }
      }

      // Get default value
      if (value === undefined) {
        value = this._getDefaultValue(param)
      }
      // Set result value
      if (value !== undefined) {
        result[key] = value
      }

      param = value = undefined

    }

    return result
  }

  softParse( parameters ) {
    if (!this.config) {
      console.warn('No configuration found')
      return
    }

    const result = {
      _: parameters.slice(0)
    }

    let params = result._.join('=').split('=')
    params     = params.filter(function(value) {
      return value.indexOf('-') === 0
    }).map(function(value) {
      return value.replace(/\-/g, '')
    })

    if (params.length === 0) {
      return result._
    }

    let key, value
    for (let i = 0, len = params.length; i < len; i++) {
      key = params[i]
      value = this._getValue( key, result._)

      if (value === undefined) {
        value = true
      }

      result[key] = value
    }

    return result
  }

  _getDefaultValue( arg ) {
    if (arg.hasOwnProperty('default')) {
      return arg.default
    }
    return undefined
  }

  _getValue( key, parameters ) {

    let k = key
    if (k.length === 1) k = `-${k}`
    else if (k.length > 1) k = `--${k}`

    const index = parameters.indexOf(k)
    let value   = undefined

    if (index !== -1) {
      value = true
      if (parameters[index+1] && parameters[index+1].indexOf('-') !== 0) {
        value = parameters[index+1]
      }

      if (value === '[') {
        let p = parameters.slice(index+2)
        const closeIndex = p.indexOf(']')

        if (closeIndex !== -1) {
          p = p.slice(0, closeIndex)
          value = this.softParse( p )
        } else {
          value = undefined
        }
      }
    }

    return value

  }

  _getFirstArgument( parameters ) {

    let value = undefined

    if (parameters[0].indexOf('-') !== 0) {
      value = parameters[0]
    }

    return value

  }

}

const ParserSingleton = new Parser

ParserSingleton.checker('boolean', function( parameter, value ) {
  return typeof value === 'boolean'
})

ParserSingleton.checker('value', function( parameter, value ) {
  return value !== null && value !== undefined && value !== ''
})

ParserSingleton.checker('select', function( parameter, value ) {
  if (parameter.values && parameter.values.indexOf(value) === -1) {
    return false
  }
  return true
})

ParserSingleton.checker('file', function( parameter, value ) {
  let res = false
  let ext = ''

  if (ParserSingleton._checkers['value'](parameter, value)) {
    ext = path.extname(value)
    res = ext.length > 1
  }

  if (parameter.extensions) {
    res = parameter.extensions.indexOf(ext) !== -1
  }

  return res
})

module.exports = ParserSingleton
