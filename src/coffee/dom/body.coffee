OJ = require '../oj'
_ = require 'lodash'
ThinDOM = require 'thindom'
nodeFactory = require './nodeFactory'


###
Persist a handle on the body node
###
if typeof document isnt 'undefined' then body = document.body else body = null
body = new ThinDOM null, id: 'body', body
body.tagName = 'body'
thinBody = nodeFactory body, {}
  
OJ.register 'body', thinBody
module.exports = thinBody