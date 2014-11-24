qunit = require 'qunit'

qunit.module 'range'
  
qunit.test '#rangeToSubRanges works with range including zero', ->
  result = OJ.ranges.toSubRanges(2, [0,3])
  qunit.deepEqual result['1'], [0,1]
  qunit.deepEqual result['2'], [2,3]
  qunit.ok !result[3]?