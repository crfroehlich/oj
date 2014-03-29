((OJ)->
  'use strict'
  OJ.nodes.register 'label', (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: 
        forAttr: ""
        form: ""
        text: ""
      styles: {}
      events:
        click: _.noop
    
    OJ.extend defaults, options
    ret = OJ.element 'label', defaults.props, defaults.styles, defaults.events
    
    if owner then owner.append ret
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ


