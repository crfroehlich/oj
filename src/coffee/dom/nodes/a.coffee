((OJ)->
  'use strict'
  OJ.nodes.register 'a', (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props:
        id: ''
        class: ''
        text: ''
        href: '#'
        type: ''
        title: ''
        rel: ''
        media: ''
        target: ''
      styles: {}
      events:
        click: _.noop

    
    OJ.extend defaults, options
    
    ret.toggleState = 'off'
    
    toggle = ->
      if ret.toggleState is 'on'
        ret.toggleState = 'off'
      else ret.toggleState = 'on'  if ret.toggleState is 'off'
      return
    
    # Click binding
    if defaults.events.click isnt _.noop
      click = defaults.events.click
      newClick = (event...) ->
        toggle
        ret = click event...
        if defaults.href is '#'
          false
        else
          retval
      defaults.events.click = newClick
    else
      defaults.events.click = toggle    
    
    ret = OJ.element 'a', defaults.props, defaults.styles, defaults.events
    if owner then owner.append ret

    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

