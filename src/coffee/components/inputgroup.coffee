OJ = require '../oj'
require '../ojInit'
require '../core/object'
require '../dom/component'
require 'jquery'

nodeName = 'x-input-group'
className = 'inputgroup'

component = do ->
  OJ.components.members[className] = nodeName

  (options, owner) ->
    forId = OJ.createUUID()
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
    ret = OJ.component defaults, owner, nodeName

    cmpnt = ret.make 'div', props: class: 'form-group'

    ret.groupLabel = cmpnt.make 'label', props: { for: forId }, text: defaults.labelText

    defaults.inputOpts.props.class += ' form-control'
    ret.groupInput = cmpnt.make 'input', defaults.inputOpts

    ret.groupValue = () ->
      ret.groupInput.val()

    ret

OJ.components.register className, component
module.exports = component