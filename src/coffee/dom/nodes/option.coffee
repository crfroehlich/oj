((OJ)->
  'use strict'
  OJ.nodes.register 'option', (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: 
        value: ''
        text: ''
        selected: ''
        disabled: ''
      styles: {}
      events:
        click: _.noop
    
    OJ.extend defaults, options
    ret = OJ.element 'option', defaults.props, defaults.styles, defaults.events
    #if owner then owner.append ret[0]
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ