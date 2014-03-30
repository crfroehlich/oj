((OJ) ->
  
  slice = Array::slice
  
  ###
  Take an arguments object and convert it into an Array
  ###
  OJ.register "getArguments", (args, sliceAt) ->
    'use strict'
    sliceAt = sliceAt or 0
    ret = slice.call(args, sliceAt)
    ret

  return
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
