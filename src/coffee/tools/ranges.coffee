((OJ) ->
  
  rangeToSubRanges = (n = 6, range = []) ->
    rangeLow = 1
    rangeHigh = 1
    vals = [];
    OJ.each range, (val) ->
      num = +range[key]
      if num > rangeHigh then rangeHigh = num
      if num < rangeLow then rangeLow = num
      if false is _.contains vals, num then vals.push num  

    distance = maxYear - minYear
    subRangeSize = distance/n
    subRanges = {}
    chunkVal = rangeLow
    i = 0;
    while i < n   
      i += 1
      if i < 6 then jump = Math.round subRangeSize
      else
        jump = Math.floor subRangeSize
      subRanges[i] = _.range chunkVal, chunkVal + jump
      chunkVal += jump
    
  
  OJ.register 'rangeToSubRanges', rangeToSubRanges

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
