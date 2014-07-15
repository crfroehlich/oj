do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  'use strict'
  
  nodeName = 'textarea'
  
  OJ.nodes.register nodeName, (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props:
        name: ""
        placeholder: ""
        value: ""
        text: ""
        maxlength: ""
        autofocus: false
        isRequired: false
        rows: 3
        cols: 25
        disabled: false
        readonly: false
        form: ""
        wrap: ""
      styles: {}
      events:
        click: OJ.noop
    
    OJ.extend defaults, options, true
    
    value = defaults.props.value
    
    syncValue = ->
      switch defaults.props.type
        when OJ.enums.inputTypes.checkbox
          value = ret.$.is(":checked")
        when OJ.enums.inputTypes.radio
          value = ret.$.find(":checked").val()
        else  
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
    
    ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text
    
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return


