'use strict'

namespace('message', function() {

  task('hello', { async: true }, function( complete ) {
    console.log('Hello World')
    setTimeout(function() {
      complete()
    }, 5000)
  })

  task('surprise', function() {
    console.log('Surprise Mother Fucka')
  })

  task('group', ['message:hello', 'message:surprise'], function() {
    console.log('All message sent!')
  })

  command('plop', 'echo plop')

  task('all', [ 'message:hello', 'message:surprise', 'message:plop' ], { preReqSequence: 'serie' }, function() {
    console.log('Everything executed with success')
  })

})