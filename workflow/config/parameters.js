module.exports = {
  boolean: ['w', 'm', 's', 'v', 'kill'],
  alias: {
    i: ['input'],
    w: ['watch'],
    o: ['output', 'out'],
    m: ['compress', 'minify', 'min'],
    s: ['sourcemaps', 'sourcemap'],
    config_path: ['configPath'],
    v: ['verbose'],
    kill: ['kill_pids']
  },
  default: {
    s: false,
    m: false,
    w: false,
    config_path: false,
    v: true,
    kill: false
  }
}