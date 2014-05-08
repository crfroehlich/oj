((OJ) ->
  nodeName = 'x-tile'
  className = 'tile'
  
  OJ.components.members[nodeName] = className
  OJ.components.register className, (options, owner) ->
    defaults = 
      smallSpan: ''
      mediumSpan: '4'
      largeSpan: ''
      props: 
        class: 'tile'
    
    OJ.extend defaults, options, true
    if defaults.spallSpan then defaults.props.class += ' col-xs-' + defaults.spallSpan
    if defaults.mediumSpan then defaults.props.class += ' col-md-' + defaults.mediumSpan
    if defaults.largeSpan then defaults.props.class += ' col-lg-' + defaults.largeSpan
    
    ret = OJ.component defaults, owner, nodeName 
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
