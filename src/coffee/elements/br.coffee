OJ = require '../oj'
nodeFactory = require '../dom/nodeFactory'
to = require '../tools/to'
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
  while i < to.number defaults.number
    # In the case of multiple brs, it is desirable to only get the last one out
    ret = nodeFactory nodeName, defaults, owner, calledFromFactory

    i += 1

 

  ret

OJ.nodes.register nodeName, node
module.exports = node

