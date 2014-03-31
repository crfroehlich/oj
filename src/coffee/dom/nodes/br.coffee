((OJ)->
  'use strict'
  OJ.nodes.register 'br', (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: {}
      styles: {}
      events:
        click: _.noop
      number: 1  
    
    OJ.extend defaults, options
    while i < OJ.number defaults.number
      # In the case of multiple brs, it is desirable to only get the last one out
      ret = OJ.element 'br', defaults.props, defaults.styles, defaults.events
      #if owner then owner.append ret[0]
      i += 1

    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

