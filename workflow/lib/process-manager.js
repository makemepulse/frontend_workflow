'use strict'

const fs    = require('fs')
const spawn = require('child_process').spawn
const paths = require('./../config/paths')

class ProcessManager {

  constructor() {
    this._onBeforeExit = this._onBeforeExit.bind(this)

    this.processes = {}

    this.activate()
  }

  /**
   * Activate listeners
   */
  activate() {
    process.on('beforeExit', this._onBeforeExit)
  }

  /**
   * Desactivate listeners
   */
  desactivate() {
    process.removeListener('beforeExit', this._onBeforeExit)
  }

  /**
   * Execute a child process
   * @param {String} psName  - Name of the process
   * @param {String} cmmnd   - Command to execute
   * @param {Object} options - List of options (stdio)
   * @returns {ChildProcess}
   */
  execute(psName, cmmnd, options) {
    options = options || {}
    options.stdio = options.stdio || 'inherit'

    const split = Array.isArray(cmmnd) ? cmmnd : cmmnd.split(' ')
    const cmd   = split.slice(0, 1)[0]
    const args  = split.slice(1)

    const ps  = spawn(cmd, args, {
      env: Object.assign({ FORCE_COLOR: true }, process.env),
      stdio: options.stdio
    })
    ps.GUID  = psName
    this._createTemporaryFile(ps)

    if (ps.stdout) {
      ps.stdout.on('data', function(data) {
        console.log(data.toString('utf-8'))
      })
    }

    if (ps.stderr) {
      ps.stderr.on('data', function(data) {
        console.log(data.toString('utf-8'))
      })
    }

    ps.on('exit', (function() {
      this._deleteTemporaryFile(this.processes[psName])
    }).bind(this))

    return ps
  }


  /**
   * Kill the child process
   * @param {ChildProcess|string} psOrGUID
   */
  killProcess(psOrGUID) {
    const child_ps = typeof psOrGUID === 'string' ? this.processes[psOrGUID] : psOrGUID
    child_ps.kill()
    this._deleteTemporaryFile(child_ps.GUID)
  }

  /**
   * Kill all pids inside tmp/pids directory
   */
  clean() {
    const files = fs.readdirSync( `${paths.pids_path}` )
    for (let filename, i = 0, len = files.length; i < len; i++) {
      filename = files[i]
      if (filename.match(/\.pid$/)) {
        const PID = fs.readFileSync(`${paths.pids_path}/${filename}`, 'utf8')
        try {
          process.kill(PID, 'SIGINT')
          P.debug(`Process ${PID} is killed (${filename}.pid)`, 'yellow')
        } catch(e) {
          P.debug(`No process '${PID}' founded`, 'grey')
        }
        fs.unlinkSync(`${paths.pids_path}/${filename}`)
      }
    }
  }

  /**
   * Before exiting kill all child process
   * @private
   */
  _onBeforeExit() {
    for (var k in this.processes) {
      this.killProcess(k)
    }
  }

  /**
   * Create a temporary file with the pid number
   * @param {ChildProcess} ps
   * @private
   */
  _createTemporaryFile(ps) {
    const psName = ps.GUID
    const stream = fs.createWriteStream(`${paths.pids_path}/${psName}.pid`)
    stream.write(ps.pid.toString())
    this.processes[psName] = ps
  }

  /**
   * Delete the temporary file of the process
   * @param {ChildProcess} ps
   * @private
   */
  _deleteTemporaryFile(ps) {
    const psName    = ps.GUID
    const file_path = `${paths.pids_path}/${psName}.pid`
    if (fs.existsSync(file_path)) fs.unlinkSync(file_path)
    delete this.processes[psName]
  }

}

module.exports = new ProcessManager