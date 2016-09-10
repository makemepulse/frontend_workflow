'use strict'

namespace('message', function() {

  task('hello', function( complete ) {
    console.log('Hello World')
    complete()
  })

  task('surprise', function( complete ) {
    console.log('Surprise Mother Fucka')
    complete()
  })

  task('all', ['message:hello', 'message:surprise'], function() {
    console.log('All message sent!')
  })

})