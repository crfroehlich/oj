((OJ)->
  'use strict'
  OJ.nodes.register 'select', (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: 
        selected: ''
        multiple: false
      styles: {}
      values: []
      events:
        click: _.noop
        change: _.noop
    
    OJ.extend defaults, options
    
    value = ''
    values = []
    hasEmpty = false;
    
    syncValue = ->
      value = ret.val()
    
    # Click binding
    if defaults.events.click isnt _.noop
      click = defaults.events.click
      newClick = (event...) ->
        retval = click event...
        syncValue()
        retval
      defaults.events.click = newClick
          
    # Change binding
    if defaults.events.change isnt _.noop
      change = defaults.events.change
      newChange = (event...) ->
        retval = change event...
        syncValue()
        retval
      defaults.events.change = newChange
    
    ret = OJ.element 'select', defaults.props, defaults.styles, defaults.events
    
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

    ret.add 'addOption', (value, text, selected = false, disabled = false) ->
      isEmpty = _.isEmpty value
      add = false
      if isEmpty and false is hasEmpty 
        hasEmpty = true 
        add = true
      if false is add and false is isEmpty then add = true  
      if add
          val = props:
            value: value
            text: text
            selected: selected
            disabled: disabled
          option = ret.option val
          option.text text
          option

    ret.add 'addOptions', (options) ->
      values = _.union values, options
      OJ.each options, ((val) ->
        value = ret.addOption(val)
        values.push value
        return
      ), false
      values

    ret.add 'resetOptions', (values) ->
      ret.empty()
      values = values;
      ret.addOptions values
      ret

    ret.add 'removeOption', (valueToRemove) ->
      values.splice values.indexOf(valueToRemove), 1 #removes the item from the list
      selectControl = ret[0]
      i = 0

      while i < selectControl.length
        selectControl.remove i  if selectControl.options[i].value is valueToRemove
        i++
      return
    
    
    if owner then owner.append ret[0]
    if defaults.values.length > 0
      ret.addOptions defaults.values
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ