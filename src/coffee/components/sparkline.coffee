OJ = require '../oj'
require '../ojInit'
component = require '../dom/component'
require 'kapusta-jquery.sparkline'

nodeName = 'x-sparkline'
className = 'sparkline'

OJ.components.members[className] = nodeName

cmpnt = (options, owner) ->
  defaults =
    config:
      type: 'line'
      height: '70'
      width: ''
      enableTagOptions: true
    data: []
    props:
      class: 'sparkline'

  OJ.extend defaults, options, true
  ret = component defaults, owner, nodeName
  ret.$.sparkline defaults.data, defaults.config

  ret

OJ.components.register className, cmpnt
module.exports = cmpnt