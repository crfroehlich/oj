OJ = require '../oj'
$ = require 'jquery'
_ = require 'lodash'
Node = require './node'

ThinDOM = require 'thindom'

# # element

element = 
  # ## restoreElement
  ###
  Restore an HTML Element through ThinDom
  ###
  restoreElement: (el, tag = el.nodeName) ->
    node = new Node
    node.element = el
    node

OJ.register 'restoreElement', element.restoreElement

OJ.register 'isElementInDom', (elementId) ->
  false is OJ.is.nullOrEmpty OJ.getElement elementId

OJ.register 'getElement', (id) ->
  if typeof document isnt 'undefined'
    document.getElementById(id)


module.exports = element