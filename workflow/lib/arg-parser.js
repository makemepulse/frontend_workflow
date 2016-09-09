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

  parse( parameters, type ) {
    if (!this.config) {
      console.warn('No configuration found')
      return
    }

    type = type || 'valid'

    if (typeof this[`_${type}Parse`] === 'function') {
      return this[`_${type}Parse`]( parameters )
    }

    return {}
  }

  _validParse( parameters ) {
    const params = this._getKeyValue(parameters.slice(0))

    return Object.assign(
      { _: params },
      this._getValidParameters( params )
    )
  }

  _invalidParse( parameters ) {
    const params = this._getKeyValue(parameters.slice(0))

    return Object.assign(
      params,
      this._getValidParameters( params )
    )
  }

  _softParse( parameters ) {
    return this._getKeyValue(parameters.slice(0))
  }

  _getValidParameters( object ) {
    const result = {}

    let param, value
    for (const key in this.config) {
      param = this.config[key]

      if (!param.type) param.type = 'boolean'

      // Get value from key
      value = object[key]

      // Get value from the first argument
      if (value === undefined && param.first_argument) {
        value = this._getFirstArgument(params)
      }

      // Get value from aliases
      if (value === undefined && param.aliases) {
        for (let i = 0, len = param.aliases.length; i < len; i++) {
          value = object[param.aliases[i]]
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

  _getDefaultValue( arg ) {
    if (arg.hasOwnProperty('default')) {
      return arg.default
    }
    return undefined
  }

  _getFirstArgument( parameters ) {

    let value = undefined

    if (parameters[0].indexOf('-') !== 0) {
      value = parameters[0]
    }

    return value

  }

  _getKeyValue(parameters) {
    if (parameters.length === 0) return { _: {} }

    const object = {}
    let params   = parameters.join('=').split('=')

    let str, key, value
    for (let i = 0, len = params.length; i < len; i++) {

      str = params[i]

      if (str && str.match(/^(-){1,2}((.{1})|(.{2,}))$/)) {
        key   = str.replace(/^-*/, '')
        value = params[i+1]

        if (value === undefined || value.indexOf('-') !== -1) {
          value = true
          params[i] = null
        } else {
          params[i] = params[i+1] = null
          i++
        }

      }

      if (value === '[') {
        let args = params.slice(i+1)
        const closeIndex = args.indexOf(']')

        if (closeIndex !== -1) {
          args = args.slice(0, closeIndex)
          value = this._getKeyValue( args )
        } else {
          value = undefined
        }

        for (let j = i; j <= i+args.length+1; j++) {
          params[j] = null
        }
      }

      if (key && value) {
        object[key] = value
      }

      key = value = null

    }

    params = params.filter(function(item) {
      return item !== null
    })

    object._ = params
    return object

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