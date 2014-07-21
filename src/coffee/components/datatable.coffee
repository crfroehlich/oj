OJ = require '../oj'
require '../ojInit'
require '../core/object'
require '../dom/component'
require 'jquery'

className = 'datatable'
component = do ->

  nodeName = 'x-datatable'

  OJ.components.members[className] = nodeName

  (options, owner) ->
    defaults =
      opts:
        data: []
        columns: []
      table:
        class: ''
      props:
        class: ''
      rootNodeType: 'table'

    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName
    ret.empty()
    ret.dataTable = ret.$.DataTable defaults.opts

    ret

OJ.components.register className, component
module.exports = component

