OJ = require '../oj'

defer = (method, waitMs) ->
  if setTimeout
    return setTimeout method, waitMs

OJ.register 'defer', defer
module.exports = defer
