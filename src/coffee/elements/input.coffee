OJ = require '../oj'
nodeFactory = require '../dom/nodeFactory'
enums = require '../tools/enums'

# # input

nodeName = 'input'
node = (options, owner = OJ.body, calledFromFactory = false) ->

  defaults =
    props:
      type: 'text'
      value: ''
    styles: {}
    events:
      click: OJ.noop
      change: OJ.noop
      focusout: OJ.noop

  OJ.extend defaults, options, true

  if not defaults.props.type or not enums.inputTypes[defaults.props.type]
    throw new Error 'No matching input type for {' + defaults.props.type + '} could be found.'
  thisType = enums.inputTypes[defaults.props.type]

  syncValue = ->
    switch thisType
      when enums.inputTypes.checkbox
        ret.value = ret.$.is ':checked'
      when enums.inputTypes.radio
        ret.value = ret.$.find(':checked').val()
      else
        ret.value = ret.val()
    defaults.props.value = ret.value    
    ret.value

  ###
    Click binding. If the caller defined a click handler,
    wrap it, sync the value of the input first,
    then call the defined click handler with the latest value.
  ###
  oldClick = defaults.events.click
  if oldClick and oldClick isnt OJ.noop
    newClick = (event...) ->
      syncValue()
      oldClick ret.value, event...
    defaults.events.click = newClick

  ###
    Change binding. If the caller defined a change handler,
    wrap it, sync the value of the input first,
    then call the defined change handler with the latest value.
  ###
  oldChange = defaults.events.change
  if oldChange and oldChange isnt OJ.noop
    newChange = (event...) ->
      syncValue()
      oldChange ret.value, event...
    defaults.events.change = newChange

  ###
    On Focus Out binding. Always use the event to update the internal
    value of the control; and if the caller defined a focusout event,
    wrap it and invoke it with the latest value
  ###
  oldFocusout = defaults.events.focusout
  newFocusout = (event...) ->
    syncValue()
    if oldFocusout and oldFocusout isnt OJ.noop
      oldFocusout ret.value, event...

  defaults.events.focusout = newFocusout


  ret = nodeFactory nodeName, defaults, owner, calledFromFactory
  ret.value = defaults.props.value
  ret

OJ.nodes.register nodeName, node
module.exports = node