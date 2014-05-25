((OJ) ->
  
  rangeToSubRanges = (n = 6, range = []) ->
    rangeLow = _.min range
    rangeHigh = _.max range
    
    distance = rangeHigh - rangeLow
    subRangeSize = distance/n
    subRanges = {}
    chunkVal = rangeLow
    i = 0;
    while i < n   
      i += 1
      if i < 6 then jump = Math.round subRangeSize
      else
        jump = Math.floor subRangeSize
        if chunkVal + jump < rangeHigh
          jump += rangeHigh - chunkVal - jump + 1
      subRanges[i] = _.range chunkVal, chunkVal + jump
      chunkVal += jump
    subRanges
  
  OJ.register 'rangeToSubRanges', rangeToSubRanges

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
