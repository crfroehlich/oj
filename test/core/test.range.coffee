do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  module 'range'
  
  test '#rangeToSubRanges works with range including zero', ->
    result = OJ.rangeToSubRanges(2, [0,3])
    deepEqual result['1'], [0,1]
    deepEqual result['2'], [2,3]
    ok !result[3]?
