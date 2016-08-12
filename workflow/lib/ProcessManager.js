'use strict'

const fs    = require('fs')
const exec  = require('child_process').exec
const Print = require('./Print')
// const Argv  = require('./Argv')
const Bind  = require('./mixins/Bind')
const paths = require('./../config/paths')

class ProcessManager {

  constructor() {
    Bind.assign(this, [ '_onBeforeExit' ])

    this.processes = {}

    this.activate()
    // if (Argv.main.fetch().kill_pids) this.clean()
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
   * @param {string} psName - Name of the process
   * @param {string} command - Command to execute
   * @returns {ChildProcess}
   */
  executeProcess(psName, command) {

    const ps     = exec(command)
    ps.GUID      = psName
    this._createTemporaryFile(ps)

    ps.stdout.setEncoding('utf-8')
    ps.stdout.on('data', function(data) {
      data = Print.clean(data.toString('utf-8'))
      Print.log([
        Print.colors['magenta'](`[${psName}]`),
        data
      ], { is_array: true })
    })

    ps.stderr.on('data', function(data) {
      data = Print.clean(data.toString('utf-8'))
      Print.log([
        Print.colors['red'](`[${psName}]`),
        data
      ], { is_array: true })
    })

    ps.on('close', (function(code){
      Print.log(`[${psName}] child process exited with code ${code}`, code === 0 || code === null ? 'magenta' : 'red')
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
          Print.log(`Process ${PID} is killed (${action}.pid)`, 'yellow')
        } catch(e) {
          Print.log(`No process '${PID}' founded`, 'grey')
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

