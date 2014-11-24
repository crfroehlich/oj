OJ = require '../oj'
el = require './element'
obj = require '../core/object'

###
Create a set of HTML Elements through ThinDom
###
control = (options = obj.object(), owner, tagName) ->
  if not tagName.startsWith 'y-' then tagName = 'y-' + tagName

  rootNodeType = options.rootNodeType or OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] or 'div'

  ret = el.element rootNodeType, options, owner, false

  ret.add 'controlName', tagName

  ret

OJ.register 'control', control
module.exports = control