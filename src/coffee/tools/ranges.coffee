OJ = require '../oj'
_ = require 'lodash'

# # ranges

rng = 

  # ## range
  # Using [Lo-Dash](http://lodash.com/docs#range)'s `range` method
  range: (params...) ->
    _.range params...

  # ## rangeMin
  # Using [Lo-Dash](http://lodash.com/docs#min)'s `min` method
  rangeMin: (params...) ->
    _.min params...

  # ## rangeMax
  # Using [Lo-Dash](http://lodash.com/docs#max)'s `max` method
  rangeMax: (params...) ->
    _.max params...

  # ## stringRangeToSubRanges
  ###
  Take an array of string values and a number of partitions to create.
  Uses the first letter of each string value in the array to convert to unique code character (lower case)
  Builds a int range based on unique code chars.
  ###
  stringRangeToSubRanges: (n = 6, range = []) ->
    charRange = []


    each range, (val) ->
      char = val.trim()[0].toLowerCase()
      if false is obj.contains charRange, char
        charRange.push char.charCodeAt()

    ret = rangeToSubRanges n, charRange

    i = 0
    while i < n
      i += 1
      subRange = ret[i]
      subRange.map String.fromCharCode

    oldGetRange = ret.getRange
    ret.getRange = (val) ->
      char = val.trim()[0].toLowerCase().charCodeAt()
      idx = oldGetRange char
      idx
    ret

  # ## rangeToSubRanges
  ###
  Take an array of int values and a number of partitions to create.
  Divides the original array into the specified number of sub arrays.
  Overflow is passed to the final partition.
  ###
  rangeToSubRanges: (n = 6, range = []) ->
    ret = obj.object()
    rangeLow = rng.rangeMin range
    rangeHigh = rng.rangeMax range

    distance = rangeHigh - rangeLow
    subRangeSize = distance/n
    subRanges = ret.add 'ranges', obj.object()
    chunkVal = rangeLow

    map = obj.object()

    i = 0
    while i < n
      i += 1
      if i < n then jump = Math.round subRangeSize
      else
        jump = Math.floor subRangeSize
        if chunkVal + jump <= rangeHigh
          jump += rangeHigh - chunkVal - jump + 1

      subRange = rng.range chunkVal, chunkVal + jump
      each subRange, (val) -> map.add val, i
      subRanges[i] = subRange
      chunkVal += jump

    ret.add 'getRange', (val) ->
      map[val]

    ret

Object.seal rng
Object.freeze rng

OJ.register 'ranges', rng
module.exports = rng  