OJ = require '../oj'
$ = require 'jquery'
_ = require 'lodash'

ThinDOM = require 'thindom'

# # element

element = 
  # ## restoreElement
  ###
  Restore an HTML Element through ThinDom
  ###
  restoreElement: (el, tag = el.nodeName) ->
    nodeFactory = require './nodeFactory'
    tD = new ThinDOM null, null, el
    tD.isInDOM = true
    ret = nodeFactory tD
    ret

OJ.register 'restoreElement', element.restoreElement

OJ.register 'isElementInDom', (elementId) ->
  false is OJ.is.nullOrEmpty OJ.getElement elementId

OJ.register 'getElement', (id) ->
  if typeof document isnt 'undefined'
    document.getElementById(id)


module.exports = element