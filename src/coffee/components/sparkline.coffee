do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  nodeName = 'x-sparkline'
  className = 'sparkline'
  
  OJ.components.members[className] = nodeName
  OJ.components.register className, (options, owner) ->
    defaults = 
      config:
        type: 'line'
        height: '70'
        width: ''
        enableTagOptions: true
      data: []
      props: 
        class: 'sparkline'
    
    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName 
    ret.$.sparkline defaults.data, defaults.config
    
    ret

  return

