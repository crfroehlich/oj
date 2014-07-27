OJ = require '../oj'
require '../ojInit'
component = require '../dom/component'
$ = require 'jquery'
require 'flot'

nodeName = 'x-flotchart'
className = 'flotchart'

OJ.components.members[className] = nodeName

cmpnt = (options, owner) ->
  defaults =
    config: {}

    data: []
    props:
      class: 'flotchart'

  OJ.extend defaults, options, true
  ret = component defaults, owner, nodeName
  ret.flot = $.plot ret.$, defaults.data, defaults.config

  ret

OJ.components.register className, cmpnt
module.exports = cmpnt