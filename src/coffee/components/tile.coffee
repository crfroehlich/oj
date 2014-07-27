OJ = require '../oj'
require '../ojInit'
component = require '../dom/component'

nodeName = 'x-tile'
className = 'tile'

OJ.components.members[className] = nodeName
  
cmpnt = (options, owner) ->
  defaults =
    width:
      xs: ''
      sm: ''
      md: ''
      lg: ''
    props:
      class: 'tile'

  OJ.extend defaults, options, true
  if defaults.width.xs then defaults.props.class += ' col-xs-' + defaults.width.xs
  if defaults.width.sm then defaults.props.class += ' col-sm-' + defaults.width.sm
  if defaults.width.md then defaults.props.class += ' col-md-' + defaults.width.md
  if defaults.width.lg then defaults.props.class += ' col-lg-' + defaults.width.lg

  ret = OJ.component defaults, owner, nodeName
  ret

OJ.components.register className, cmpnt
module.exports = cmpnt