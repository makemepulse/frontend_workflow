const Print = require('./print')
const fs = require('fs-extra')

const ProcessManager = (function(){

  const dirPath      = `${__dirname}/../tmp`
  var current_action = null

  const _kill = function(action) {
    const file_path = `${dirPath}/${action}_pid.txt`
    if (fs.existsSync(file_path)) {
      const PID = fs.readFileSync(file_path, 'utf8')
      try {
        process.kill(PID, 'SIGINT')
        Print.log(`Process ${PID} is killed (${action}_pid.txt)`, true, 'yellow')
      } catch(e) {
        Print.log(`No process founded`, true, 'grey')
      }
    }
  }

  const _write = function(action) {
    const stream = fs.createWriteStream(`${dirPath}/${action}_pid.txt`)
    stream.write(process.pid.toString())
    current_action = action
  }

  process.on('beforeExit', function() {
    if (current_action) {
      const file_path = `${dirPath}/${current_action}_pid.txt`
      if (fs.existsSync(file_path)) fs.unlinkSync(file_path)
    }
  })

  return {
    kill: _kill,
    write: _write
  }

})()

module.exports = ProcessManager
