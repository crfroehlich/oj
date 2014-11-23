qunit = require 'qunit'

qunit.module 'range'
  
test '#rangeToSubRanges works with range including zero', ->
  result = OJ.rangeToSubRanges(2, [0,3])
  deepEqual result['1'], [0,1]
  deepEqual result['2'], [2,3]
  ok !result[3]?