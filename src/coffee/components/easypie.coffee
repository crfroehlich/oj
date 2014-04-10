((OJ) ->
  nodeName = 'x-easypie'
  className = 'easypie'
  
  OJ.components.members[nodeName] = className
  OJ.components.register className, (options, owner) ->
    defaults = 
      config:
        percent: '50'
        size: '95'
        lineWidth: ''
        trackColor: '#efefef'
        scaleColor: 'false'
      data: []
      props: 
        class: 'easy-pie inline-block primary'
    
    OJ.extend defaults, options
    ret = OJ.component defaults, owner, nodeName 
    defaults.props['data-percent'] = defaults.config.percent
    
    easypie = ret.div defaults
    
    easypie.$.easypie defaults.config
    
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
