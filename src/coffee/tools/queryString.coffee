do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  
  ###
  http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  ###
  OJ.register 'queryString', (param) ->
    ret = {}
    
    if OJ.global.location
      params =  OJ.global.location.search.substr(1).split '&'
      if params
        i = 0
        while i < params.length
          prm = params[i].split '='
          if prm.length is 2 
            ret[prm[0]] = OJ.global.decodeURIComponent prm[1].replace(/\+/g, " ")
          i += 1
    ret
    
  return
  
  

