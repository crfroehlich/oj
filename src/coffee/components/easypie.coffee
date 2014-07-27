OJ = require '../oj'
require '../ojInit'
component = require '../dom/component'
require 'jquery.easy-pie-chart'

nodeName = 'x-easypie'
className = 'easypie'

OJ.components.members[className] = nodeName
  
cmpnt = (options, owner) ->
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
  ret = component defaults, owner, nodeName
  ret.$.easyPieChart defaults.config

  ret

OJ.components.register className, cmpnt
module.exports = cmpnt