OJ = require '../oj'

defer = (method, waitMs) ->
  ret = null
  if setTimeout
    ret = setTimeout method, waitMs
  ret

OJ.register 'defer', defer
module.exports = defer
