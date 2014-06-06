# # br

((OJ)->
  'use strict'
  
  nodeName = 'br'
  
  OJ.nodes.register nodeName, (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: {}
      styles: {}
      events:
        click: OJ.noop
      number: 1  
    
    OJ.extend defaults, options, true
    i = 0
    while i < OJ.to.number defaults.number
      # In the case of multiple brs, it is desirable to only get the last one out
      ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text
      
      i += 1

    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

