OJ = require '../oj'
require '../ojInit'
component = require '../dom/component'
uuid = require '../tools/uuid'

nodeName = 'x-input-group'
className = 'inputgroup'

OJ.components.members[className] = nodeName

cmpnt = (options, owner) ->
  forId = uuid()
  defaults =
    props:
      class: 'form-group'
    events:
      change: OJ.noop
    for: forId
    labelText: ''
    inputOpts:
      props:
        id: forId
        type: 'text'
        class: ''
        placeholder: ''
        value: ''

  OJ.extend defaults, options, true
  ret = component defaults, owner, nodeName

  group = ret.make 'div', props: class: 'form-group'

  ret.groupLabel = group.make 'label', props: { for: forId }, text: defaults.labelText

  defaults.inputOpts.props.class += ' form-control'
  ret.groupInput = group.make 'input', defaults.inputOpts

  ret.groupValue = () ->
    ret.groupInput.val()

  ret

OJ.components.register className, cmpnt
module.exports = cmpnt