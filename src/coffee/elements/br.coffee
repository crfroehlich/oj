OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'

# # br

nodeName = 'br'

node = (options, owner = OJ.body, calledFromFactory = false) ->

  defaults =
    props: {}
    styles: {}
    events:
      click: OJ.noop
    number: 1

  OJ.extend defaults, options, true
  i = 0
  while i < OJ.to.number defaults.number
    # In the case of multiple brs, it is desirable to only get the last one out
    ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text

    i += 1

  if false is calledFromFactory then OJ.nodes.factory ret, owner

  ret

OJ.nodes.register nodeName, node
module.exports = node

