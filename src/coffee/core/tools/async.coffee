((OJ) ->
  
  defer = (method, waitMs) ->
    if setTimeout
      return setTimeout method, waitMs
  
  OJ.register 'defer', defer

  return
) (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
