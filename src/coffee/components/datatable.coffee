OJ = require '../oj'
require '../ojInit'
component = require '../dom/component'

className = 'datatable'
nodeName = 'x-datatable'

OJ.components.members[className] = nodeName

cmpnt = (options, owner) ->
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
  ret = component defaults, owner, nodeName
  ret.empty()
  ret.dataTable = ret.$.DataTable defaults.opts

  ret

OJ.components.register className, cmpnt
module.exports = cmpnt

