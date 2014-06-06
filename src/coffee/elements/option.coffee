# # option

((OJ)->
  'use strict'
  
  nodeName = 'option'
  
  OJ.nodes.register nodeName, (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: 
        value: ''
        text: ''
        selected: ''
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