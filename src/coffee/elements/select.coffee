OJ = require '../oj'
nodeFactory = require '../dom/nodeFactory'

# # select

nodeName = 'select'

node = (options, owner, calledFromFactory = false) ->

  defaults =
    props:
      selected: ''
      multiple: false
    styles: {}
    values: []
    events:
      click: OJ.noop
      change: OJ.noop

  OJ.extend defaults, options, true

  value = ''
  values = []
  hasEmpty = false

  syncValue = ->
    value = ret.val()

  # Click binding
  if defaults.events.click isnt OJ.noop
    click = defaults.events.click
    newClick = (event...) ->
      retval = click event...
      syncValue()
      retval
    defaults.events.click = newClick

  # Change binding
  if defaults.events.change isnt OJ.noop
    change = defaults.events.change
    newChange = (event...) ->
      retval = change event...
      syncValue()
      retval
    defaults.events.change = newChange

  ret = nodeFactory nodeName, defaults, owner, calledFromFactory

  ret.add 'selectedData', (propName) ->
    ret = ''
    if ret.$.find('option:selected') and ret.$.find('option:selected')[0]
      dataset = ret.$.find('option:selected')[0].dataset
      ret = dataset[propName]  if dataset
    ret

  ret.add 'selectedText', ->
    ret.$.find('option:selected').text()

  ret.add 'selectedVal', ->
    value = ret.val()
    value

  ret.add 'addOption', (value, text = value, selected = false, disabled = false) ->
    isEmpty = _.isEmpty value
    add = false
    if isEmpty and false is hasEmpty
      hasEmpty = true
      add = true
    if false is add and false is isEmpty then add = true
    if add
      val =
        text: text
        props:
          value: value
      if selected
        val.selected = selected
      if disabled
        val.disabled = disabled
      option = ret.make 'option', val
      option

  ret.add 'addOptions', (options) ->
    values = _.union values, options
    OJ.each options, ((val) ->
      value = ret.addOption(val)
      values.push value
    ), false
    values

  ret.add 'resetOptions', (values) ->
    ret.empty()
    values = values
    ret.addOptions values
    ret

  ret.add 'removeOption', (valueToRemove) ->
    values.splice values.indexOf(valueToRemove), 1 #removes the item from the list
    selectControl = ret[0]
    i = 0

    while i < selectControl.length
      selectControl.remove i  if selectControl.options[i].value is valueToRemove
      i++
    null



  if defaults.values.length > 0
    ret.addOptions defaults.values

 

  ret

OJ.nodes.register nodeName, node
module.exports = node