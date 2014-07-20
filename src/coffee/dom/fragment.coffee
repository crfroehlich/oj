OJ = require '../oj'
require './element'

# # fragment

# Create a document fragment and return it as an OJ node
fragment = ->
  ret = null
  if typeof document isnt 'undefined'
    fragment = document.createDocumentFragment()
    ret = OJ.restoreElement fragment, 'fragment'
  ret

OJ.register 'fragment', fragment
module.exports = fragment