'use strict'

module.exports = {

  command() {

    let args = Array.prototype.slice.call(arguments),
        arg,
        name,
        obj,
        prereqs,
        opts,
        command;

    // name, [deps], [action]
    // Name (string) + deps (array) format
    if (typeof args[0] == 'string') {
      name = args.shift();
      if (Array.isArray(args[0])) {
        prereqs = args.shift();
      }
    }
    // name:deps, [action]
    // Legacy object-literal syntax, e.g.: {'name': ['depA', 'depB']}
    else {
      obj = args.shift();
      for (var p in obj) {
        prereqs = prereqs.concat(obj[p]);
        name = p;
      }
    }

    // Optional opts/callback or callback/opts
    while ((arg = args.shift())) {
      if (typeof arg == 'string') {
        command = arg;
      }
      else {
        opts = arg;
      }
    }

    opts = opts || {}

    const execOptions = jake.mixin({
      printStdout: true
    }, opts.execOptions || {})

    const action = function() {
      jake.exec(command, execOptions, function() {
        if (opts.async) complete()
      })
    }

    const a = [name, prereqs, action, opts].filter(function(arg) {
      return !!arg
    })

    return task(...a)

  }

}