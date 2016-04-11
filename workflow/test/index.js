const assert = require('assert')

const Task        = require('./../lib/Task')
const TaskManager = require('./../lib/TaskManager')

const Stylus     = require('./../tasks/stylus')

describe('TaskProcess', function() {

  it('Execute a child process', function(done) {
    assert.doesNotThrow(function(){
      const stylusConfig = {
        override_parameters: {
          input: './workflow/test/app/index.styl',
          output: './workflow/test/public/main.css'
        }
      }
      const task = Stylus.create('stylus', stylusConfig)
      task.options.argv.replace('node workflow stylus -s'.split(' '))
      TaskManager.on('task:kill', function() {
        done()
      })
      task.execute()
    })
  })

})
