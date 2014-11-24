qunit = require 'qunit'

qunit.module 'ajax'
  
qunit.asyncTest 'Test ajax promises', ->
  expect 1
    
  OJ.async.ajax.get 'async/test.ajax.json'
    .then ->
      qunit.ok true, 'Event was successfully called'
      qunit.start()
    .catch ->
      qunit.deepEqual NaN, true, 'Event failed'