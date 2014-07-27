OJ = require '../oj'
el = require '../dom/element'
to = require '../tools/to'
# # br

nodeName = 'br'

node = (options, owner = require('../dom/body'), calledFromFactory = false) ->

  defaults =
    props: {}
    styles: {}
    events:
      click: OJ.noop
    number: 1

  OJ.extend defaults, options, true
  i = 0
  while i < to.number defaults.number
    # In the case of multiple brs, it is desirable to only get the last one out
    ret = el.element nodeName, defaults, owner, calledFromFactory

    i += 1

  if false is calledFromFactory then nodesFactory ret, owner

  ret

OJ.nodes.register nodeName, node
module.exports = node

