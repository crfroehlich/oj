OJ = require '../oj'
require '../ojInit'
require '../core/object'
require '../dom/component'
require 'jquery'

nodeName = 'x-sparkline'
className = 'sparkline'

component = do ->
  OJ.components.members[className] = nodeName
  (options, owner) ->
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
    ret = OJ.component defaults, owner, nodeName
    ret.$.sparkline defaults.data, defaults.config

    ret

OJ.components.register className, component
module.exports = component