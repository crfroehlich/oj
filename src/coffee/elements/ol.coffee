OJ = require '../oj'
nodeFactory = require '../dom/nodeFactory'

# # ol

nodeName = 'ol'

node = (options, owner = OJ.body, calledFromFactory = false) ->

  defaults =
    props: {}
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true
  ret = nodeFactory nodeName, defaults, owner, calledFromFactory


 

  ret

OJ.nodes.register nodeName, node
module.exports = node