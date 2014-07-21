OJ = require 'ojs'
QUnit.module 'pubSub'

QUnit.asyncTest 'Test pubsub', ->
  expect 1

  method = () ->
    ok true, 'Event was successfully called'
    start()

  OJ.subscribe 'PubSub Test', method
  OJ.publish 'PubSub Test'

  