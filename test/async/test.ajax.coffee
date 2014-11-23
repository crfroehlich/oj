qunit = require 'qunit'

qunit.module 'ajax'
  
asyncTest 'Test ajax promises', ->
  expect 1
    
  OJ.async.ajax.get 'async/test.ajax.json'
    .then ->
      ok true, 'Event was successfully called'
      start()
    .catch ->
      deepEqual NaN, true, 'Event failed'