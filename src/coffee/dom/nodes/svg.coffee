((OJ)->
  'use strict'
  OJ.nodes.register 'svg', (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: {}
      styles: {}
      events:
        click: _.noop
    
    OJ.extend defaults, options
    ret = OJ.element 'svg', defaults.props, defaults.styles, defaults.events
    if owner then owner.append ret
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ