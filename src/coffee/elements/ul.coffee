OJ = require '../oj'
el = require '../dom/element'

nodeName = 'ul'

node = (options, owner = OJ.body, calledFromFactory = false) ->

  defaults =
    props: {}
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true
  ret = el.element nodeName, defaults, owner, calledFromFactory


 

  ret

OJ.nodes.register nodeName, node
module.exports = node