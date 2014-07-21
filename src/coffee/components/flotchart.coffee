OJ = require '../oj'
require '../ojInit'
require '../core/object'
require '../dom/component'
require 'jquery'

nodeName = 'x-flotchart'
className = 'flotchart'

component = do ->
  OJ.components.members[className] = nodeName
  (options, owner) ->
    defaults =
      config: {}

      data: []
      props:
        class: 'flotchart'

    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName
    ret.flot = $.plot ret.$, defaults.data, defaults.config

    ret

OJ.components.register className, component
module.exports = component