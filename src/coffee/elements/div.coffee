# # div

((OJ)->
  'use strict'
  
  # register semantic/structural aliases
  for nodeName in [ 'div', 'section', 'header', 'footer' ]
    ((tag) -> 
      OJ.nodes.register tag, (options, owner = OJ.body, calledFromFactory = false) ->

        defaults =
          props: {}
          styles: {}
          events:
            click: OJ.noop

        OJ.extend defaults, options, true
        ret = OJ.element tag, defaults.props, defaults.styles, defaults.events, defaults.text


        if false is calledFromFactory then OJ.nodes.factory ret, owner

        ret
    )(nodeName)
  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

