OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'

# # ol

nodeName = 'ol'

node = (options, owner = OJ.body, calledFromFactory = false) ->

  defaults =
    props: {}
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true
  ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text


  if false is calledFromFactory then OJ.nodes.factory ret, owner

  ret

OJ.nodes.register nodeName, node
module.exports = node