((OJ) ->
  nodeName = 'x-flotchart'
  className = 'flotchart'
  
  OJ.components.members[nodeName] = className
  OJ.components.register className, (options, owner) ->
    defaults = 
      config: {}
        
      data: []
      props: 
        class: 'flotchart'
    
    OJ.extend defaults, options
    ret = OJ.component defaults, owner, nodeName 
    ret.flot = $.plot ret.$, defaults.data, defaults.config 

    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
