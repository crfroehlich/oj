OJ = require '../oj'
  
defer = (method, waitMs) ->
  if waitMs and setTimeout
    setTimeout method, waitMs
  (new Promise (resolve) ->
    resolve()).then method
  
OJ.register 'defer', defer
module.exports = defer