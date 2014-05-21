((OJ) ->
  nodeName = 'x-tile'
  className = 'tile'
  
  OJ.components.members[nodeName] = className
  OJ.components.register className, (options, owner) ->
    defaults = 
      width: 
        xs: ''
        sm: ''
        md: ''
        lg: ''
      props: 
        class: 'tile'
      
    OJ.extend defaults, options, true
    if defaults.width.xs then defaults.props.class += ' col-xs-' + defaults.width.xs
    if defaults.width.sm then defaults.props.class += ' col-sm-' + defaults.width.sm
    if defaults.width.md then defaults.props.class += ' col-md-' + defaults.width.md
    if defaults.width.lg then defaults.props.class += ' col-lg-' + defaults.width.lg
    
    ret = OJ.component defaults, owner, nodeName 
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
