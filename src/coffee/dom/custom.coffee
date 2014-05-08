((OJ)->
  'use strict'
  OJ.nodes.register 'custom', (tagName, options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: {}
      styles: {}
      events:
        click: _.noop
      number: 1  
    
    OJ.extend defaults, options, true
    ret = OJ.element tagName, defaults.props, defaults.styles, defaults.events
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

