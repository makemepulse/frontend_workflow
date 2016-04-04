'use strict'

const fs    = require('fs')
const exec  = require('child_process').exec
const Print = require('./Print')
const Bind  = require('./mixins/Bind')
const paths = require('./../config/paths')

class ProcessManager {

  constructor() {
    Object.assign(this, Bind)
    this.bindMethods()

    this.processes = {}

    this.activate()
    this.clean()
  }

  bindMethods() {
    this.bind([ '_onBeforeExit' ])
  }

  activate() {
    process.on('beforeExit', this._onBeforeExit)
  }

  desactivate() {
    process.removeListener('beforeExit', this._onBeforeExit)
  }

  executeProcess(psName, command) {

    const ps     = exec(command)
    ps.GUID      = psName
    this._createTemporaryFile(ps)

    ps.stdout.setEncoding('utf-8')
    ps.stdout.on('data', function(data) {
      data = Print.clean(data.toString('utf-8'))
      Print.log(`[${psName}] ${data}`, true, 'magenta')
    })

    ps.stderr.on('data', function(data) {
      data = Print.clean(data.toString('utf-8'))
      Print.log(`[${psName}] ${data}`, true, 'red')
    })

    ps.on('close', (function(code){
      Print.log(`[${psName}] child process exited with code ${code}`, true, 'magenta')
      this._deleteTemporaryFile(this.processes[psName])
    }).bind(this))

    return ps

  }

  killProcess(psOrGUID) {
    const child_ps = typeof psOrGUID === 'string' ? this.processes[psOrGUID] : psOrGUID
    child_ps.kill()
    this._deleteTemporaryFile(child_ps.GUID)
  }

  clean() {
    const files = fs.readdirSync( `${paths.pids_path}` )
    for (let filename, i = 0, len = files.length; i < len; i++) {
      filename = files[i]
      if (filename.match(/\.pid$/)) {
        const PID = fs.readFileSync(`${paths.pids_path}/${filename}`, 'utf8')
        try {
          process.kill(PID, 'SIGINT')
          Print.log(`Process ${PID} is killed (${action}.pid)`, true, 'yellow')
        } catch(e) {
          Print.log(`No process founded`, true, 'grey')
        }
        fs.unlinkSync(`${paths.pids_path}/${filename}`)
      }
    }
  }

  _onBeforeExit() {
    for (var k in this.processes) {
      this.killProcess(k)
    }
  }

  _createTemporaryFile(ps) {
    const psName = ps.GUID
    const stream = fs.createWriteStream(`${paths.pids_path}/${psName}.pid`)
    stream.write(ps.pid.toString())
    this.processes[psName] = ps
  }

  _deleteTemporaryFile(ps) {
    const psName    = ps.GUID
    const file_path = `${paths.pids_path}/${psName}.pid`
    if (fs.existsSync(file_path)) fs.unlinkSync(file_path)
    delete this.processes[psName]
  }

}

module.exports = new ProcessManager

