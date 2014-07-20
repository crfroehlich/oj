OJ = require '../oj'
require '../ojInit'
require '../core/object'
require '../dom/component'
require 'jquery'

nodeName = 'x-easypie'
className = 'easypie'

component = do ->

  OJ.components.members[className] = nodeName
  (options, owner) ->
    defaults =
      config:
        barColor: '#efefef'
        percent: '50'
        size: '95'
        lineWidth: ''
        trackColor: '#efefef'
        scaleColor: 'false'
      data: []
      props:
        class: 'chart easy-pie inline-block primary'

    OJ.extend defaults, options, true
    defaults.props['data-percent'] = defaults.config.percent
    ret = OJ.component defaults, owner, nodeName
    ret.$.easyPieChart defaults.config

    ret

OJ.components.register className, component
module.exports = component