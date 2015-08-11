OJ = require '../oj'
_ = require 'lodash'
Node = require './node'


###
Persist a handle on the body node
###
if typeof document isnt 'undefined' then body = document.body else body = null
ojBody = new Node
ojBody.element = body
  
OJ.register 'body', ojBody
module.exports = ojBody