((OJ)->
  'use strict'
  
  nodeName = 'legend'
  
  OJ.nodes.register nodeName, (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props:
        form: ''
        disabled: ''
      styles: {}
      events:
        click: OJ.noop
    
    OJ.extend defaults, options, true
    ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text
    
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ