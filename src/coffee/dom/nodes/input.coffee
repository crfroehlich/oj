((OJ)->
  'use strict'
  
  nodeName = 'input'
  
  OJ.nodes.register nodeName, (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props:
        type: OJ.enums.inputTypes.text
        placeholder: ""
        value: ""
        size: ""
        maxlength: ""
        autofocus: false
        autocomplete: "on"
        checked: false
      styles: {}
      events:
        click: _.noop
        change: _.noop
        keyenter: _.noop
        keyup: _.noop
        focusout: _.noop

    
    OJ.extend defaults, options, true
    
    syncValue = ->
      switch defaults.props.type
        when OJ.enums.inputTypes.checkbox
          ret.value = ret.$.is(":checked")
        when OJ.enums.inputTypes.radio
          ret.value = ret.$.find(":checked").val()
        else  
          ret.value = ret.val()
      ret.value    
    
    # Click binding
    oldClick = defaults.events.click
    newClick = (event...) ->
      syncValue()
      oldClick event...
        
    defaults.events.click = newClick
          
    # Change binding
    oldChange = defaults.events.change
    newChange = (event...) ->
      syncValue()
      oldChange event...
        
    defaults.events.change = newChange
    
    # Change binding
    oldFocusout = defaults.events.focusout
    newFocusout = (event...) ->
      syncValue()
      oldFocusout event...
        
    defaults.events.focusout = newFocusout
    
    
    ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text
    ret.value = defaults.props.value
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

