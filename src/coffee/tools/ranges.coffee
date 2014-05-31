((OJ) ->
  
  ###
  Take an array of string values and a number of partitions to create.
  Uses the first letter of each string value in the array to convert to unique code character (lower case)
  Builds a int range based on unique code chars. 
  ###
  stringRangeToSubRanges = (n = 6, range = []) ->
    charRange = []
    
    
    OJ.each range, (val) ->
      char = val.trim()[0].toLowerCase()
      if false is _.contains charRange, char
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
    
  
  ###
  Take an array of int values and a number of partitions to create.
  Divides the original array into the specified number of sub arrays.
  Overflow is passed to the final partition.
  ###
  rangeToSubRanges = (n = 6, range = []) ->
    ret = OJ.object()
    rangeLow = _.min range
    rangeHigh = _.max range
    
    distance = rangeHigh - rangeLow
    subRangeSize = distance/n
    subRanges = ret.add 'ranges', OJ.object()
    chunkVal = rangeLow
    
    map = OJ.object()
    
    i = 0;
    while i < n   
      i += 1
      if i < n then jump = Math.round subRangeSize
      else
        jump = Math.floor subRangeSize
        if chunkVal + jump <= rangeHigh
          jump += rangeHigh - chunkVal - jump + 1
      
      subRange = _.range chunkVal, chunkVal + jump
      OJ.each subRange, (val) -> map.add val, i
      subRanges[i] = subRange
      chunkVal += jump
    
    ret.add 'getRange', (val) ->
      map[val] 
    
    ret
  
  OJ.register 'stringRangeToSubRanges', stringRangeToSubRanges
  OJ.register 'rangeToSubRanges', rangeToSubRanges

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
