((OJ)->
  'use strict'
  OJ.nodes.register 'img', (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: 
        src: ""
        alt: ""
        title: ""
        height: ""
        ismap: ""
        usemap: ""
        border: 0
        width: ""
      styles: {}
      events:
        click: _.noop
    
    OJ.extend defaults, options
    ret = OJ.element 'img', defaults.props, defaults.styles, defaults.events
    
    if owner then owner.append ret
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ


