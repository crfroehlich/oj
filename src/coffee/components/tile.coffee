((OJ) ->
  nodeName = 'x-tile'
  className = 'tile'
  
  OJ.components.members[nodeName] = className
  OJ.components.register className, (options, owner) ->
    defaults = 
      props: 
        class: 'tile'
    
    OJ.extend defaults, options
    ret = OJ.component defaults, owner, nodeName 
    
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
