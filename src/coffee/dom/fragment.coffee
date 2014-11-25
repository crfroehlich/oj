OJ = require '../oj'
nodeFactory = require './nodeFactory'

# # fragment

# Create a document fragment and return it as an OJ node
fragment = ->
  ret = null
  if typeof document isnt 'undefined'
    fragment = document.createDocumentFragment()
    
    frag = new ThinDOM null, null, fragment
    frag.isInDOM = true
    ret = nodeFactory frag
    
  ret

OJ.register 'fragment', fragment
module.exports = fragment