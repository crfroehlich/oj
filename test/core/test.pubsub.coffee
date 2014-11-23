qunit = require 'qunit'

qunit.module 'pubSub'
  
asyncTest 'Test pubsub', ->
  expect 1
    
  method = () ->
    ok true, 'Event was successfully called'
    start()
      
  OJ.subscribe 'PubSub Test', method
  OJ.publish 'PubSub Test'  