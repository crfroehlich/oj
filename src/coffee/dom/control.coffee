OJ = require '../oj'
require '../ojInit'
require './element'
require './nodeFactory'
require '../core/object'

###
Create a set of HTML Elements through ThinDom
###
control = (options = OJ.object(), owner, tagName) ->
  if not tagName.startsWith 'y-' then tagName = 'y-' + tagName

  rootNodeType = options.rootNodeType or OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] or 'div'

  ret = OJ.element rootNodeType, options.props, options.styles, options.events, options.text
  OJ.nodes.factory ret, owner

  ret.add 'controlName', tagName

  ret

OJ.register 'control', control
module.exports = control