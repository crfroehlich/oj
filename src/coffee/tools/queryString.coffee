OJ = require '../oj'
  
###
http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
###
queryString = (param) ->
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
    
OJ.register 'queryString',queryString
module.exports = queryString