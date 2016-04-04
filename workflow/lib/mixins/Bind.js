'use strict'

const Bind = (function() {

  const _getBinder = function(fnName, ctx) {
    if (!ctx) { ctx = this; }
    if (!this._binders) this._binders = []
    return this._binders.find((binder) => {
      return binder.fnName === fnName && binder.ctx === ctx
    })
  }

  const _bind = function(fnNameOrArray, ctx, override){
    if (!ctx) { ctx = this; }
    if (typeof override !== 'boolean') override = true

    const fnName = fnNameOrArray;
    if (typeof fnNameOrArray !== 'string') {
      for (var i = 0; i < fnNameOrArray.length; i++) {
        this.bind(fnNameOrArray[i])
      }
      return;
    }

    let binder = this.getBinder(fnName, ctx)
    if(!binder) {
      binder = { fnName: fnName, ctx: ctx, original: ctx[fnName] }
      this._binders.push(binder)
    }

    if (override) {
      if (!ctx[fnName]) {
        console.warn('The method '+fnName+' does not exist')
        return;
      }
      ctx[fnName] = binder.ctx[binder.fnName].bind(binder.ctx)
    }

  }

  const _unbind = function(fnNameOrArray, ctx) {
    if (!ctx) { ctx = this; }

    const fnName = fnNameOrArray;
    if (typeof fnNameOrArray !== 'string') {
      for (var i = 0; i < fnNameOrArray.length; i++) {
        this.bind(fnNameOrArray[i])
      }
      return;
    }

    const binder = this.getBinder(fnName, ctx)
    if (!binder) {
      console.warn(`Cannot unbind "${fnName}", because this method was never binded before`)
      return
    }

    ctx[fnName] = binder.original
  }

  return {
    bind: _bind,
    unbind: _unbind,
    getBinder: _getBinder
  }

})();

module.exports = Bind