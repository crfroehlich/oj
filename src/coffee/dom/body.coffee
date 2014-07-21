OJ = require '../oj'
_ = require 'lodash'
require 'thindom'

###
Persist a handle on the body node
###
if typeof document isnt 'undefined' then body = document.body else body = null
thinBody = ThinDOM null, id: 'body', body
thinBody.isInDOM = true
thinBody.getId = ->
  'body'

thinBody.init = _.once -> 
  nodeFactory = require './nodeFactory'
  element = require './element'
  dom = require './dom'

  element.finalize thinBody, 'body'
  thinBody.count = 0
  thinBody.root = null
  dom thinBody, null
  nodeFactory.addMakeMethod thinBody, 0
  thinBody.isFullyInit = true  
  
OJ.register 'body', thinBody
module.exports = thinBody