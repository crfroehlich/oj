((OJ)->
  'use strict'
  
  nodeName = 'a'
  
  OJ.nodes.register nodeName, (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props:
        id: ''
        class: ''
        text: ''
        href: 'javaScript:void(0);'
        type: ''
        title: ''
        rel: ''
        media: ''
        target: ''
      styles: {}
      events:
        click: _.noop

    
    OJ.extend defaults, options, true
    
    toggleState = 'off'
    
    toggle = ->
      if toggleState is 'on'
        toggleState = 'off'
      else toggleState = 'on'  if toggleState is 'off'
      return
    
    # Click binding
    if defaults.events.click isnt _.noop
      click = defaults.events.click
      newClick = (event...) ->
        toggle()
        retVal = click event...
        if defaults.href is '#' then retVal = false
        retVal
      defaults.events.click = newClick
    else
      defaults.events.click = toggle    
    
    ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text
    

    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

