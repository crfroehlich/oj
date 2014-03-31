((OJ)->
  'use strict'
  OJ.nodes.register 'legend', (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props:
        form: ''
        disabled: ''
      styles: {}
      events:
        click: _.noop
    
    OJ.extend defaults, options
    ret = OJ.element 'legend', defaults.props, defaults.styles, defaults.events
    #if owner then owner.append ret[0]
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ