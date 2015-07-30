OJ = require '../oj'
_ = require 'lodash'
Node = require './node'


###
Persist a handle on the body node
###
if typeof document isnt 'undefined' then body = document.body else body = null
body = new Node body
  
OJ.register 'body', body
module.exports = body