do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  
  array2D = (initLength, initWidth) ->
    array = []
    maxLength = 0
    maxWidth = 0
    
    ret = 
      get: (rowNo, colNo) ->
        extend rowNo, colNo
      set: (rowNo, colNo, val) ->
        ret.get rowNo, colNo
        rowIdx = rowNo-1
        colIdx = colNo-1
        array[rowIdx][colIdx] = val
      each: (callBack) ->
        _.each array, (columns, row) ->
          _.each array[row], (val, col) ->
            rowIdx = row+1
            colIdx = col+1
            callBack rowIdx, colIdx, val
      width: () ->
        maxWidth
      length: () ->
        maxLength
         
    ###
    Guarantee that the dimensions of the array are always backed by values at every position
    ###                    
    extend = (length, width) ->  
      if not length or length < 1 then length = 1
      if not width or width < 1 then width = 1
      
      if maxLength < length then maxLength = length
      if array.length > maxLength then maxLength = array.length
      if maxWidth < width then maxWidth = width
      i = 0
      
      while i < maxLength
        tryRow = array[i]
        if not tryRow
          tryRow = []
          array.push tryRow
        if maxWidth < tryRow.length then maxWidth = tryRow.length
        if tryRow.length < maxWidth then tryRow.length = maxWidth
        i += 1
      
      array[length-1][width-1]
       
    extend initLength, initWidth
    
    ret
  OJ.register 'array2D', array2D

  return

